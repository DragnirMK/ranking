const logger = require('../../utils/logger');
const Room = require('../../models/room');
const { logSocketsInRoom, getConnectedUsersData } = require('./utils');

const handleCreateRoom = async (io, socket, pinCode, userId) => {
    logger.info(`User ${userId} created room with PIN code ${pinCode}`);

    const room = await Room.findOne({ 'pinCode': pinCode });

    if (!room) {
        logger.info("No room found");
        return;
    }

    socket.pinCode = room.pinCode
    socket.userId = userId

    socket.join(room.pinCode);

    await logSocketsInRoom(io, room.pinCode);

    logger.info("Sending roomCreated event")

    io.to(room.pinCode).emit('roomCreated', { pinCode: pinCode });
}

const handleJoinRoom = async (io, socket, pinCode, userId) => {
    logger.info(`User ${userId} joined room with PIN code ${pinCode}`);

    const room = await Room.findOne({ 'pinCode': pinCode });

    if (!room) {
        logger.info("No room found")
        return;
    }

    const connectedUsers = await io.in(room.pinCode).fetchSockets();

    if (connectedUsers.length >= 12) {
        logger.info("Room is full")
        return;
    }

    let inGame = false

    // This room is currently in game. Only reconnect users that are players 
    if (room.players.length > 0) {
        logger.info(`Room with PIN code ${pinCode} is currently in game`);
        inGame = true
        const playerIndex = room.players.findIndex((player) => player.user.toString() === userId);
        if (playerIndex === -1) {
            logger.info(`User ${userId} is not a player, joinRoom denied.`);
            return;
        }
        logger.info(`User ${userId} is a player, joinRoom allowed.`);
    }

    socket.pinCode = room.pinCode
    socket.userId = userId

    socket.join(room.pinCode);

    await logSocketsInRoom(io, room.pinCode);

    const players = await getConnectedUsersData(io, room.pinCode)

    logger.info("Sending playerJoined event")

    io.to(room.pinCode).emit('playerJoined', { players: players, numPlayers: players.length, createdBy: room.createdBy, inGame });
}

const handleDisconnection = async (io, socket) => {
    logger.info('User disconnecting:', socket.id);

    const pinCode = socket.pinCode;
    const userId = socket.userId;

    if (!pinCode || !userId) {
        logger.info("No pinCode or userId found on the socket.")
        return;
    }

    const room = await Room.findOne({ 'pinCode': pinCode });
    if (!room) {
        logger.info("No room found")
        return;
    }

    await logSocketsInRoom(io, room.pinCode);

    const players = await getConnectedUsersData(io, room.pinCode)

    logger.info("Sending playerLeft event")

    io.to(room.pinCode).emit('playerLeft', { players: players, numPlayers: players.length });
}

module.exports = {
    handleCreateRoom, handleJoinRoom, handleDisconnection
}