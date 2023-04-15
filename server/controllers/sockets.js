const logger = require('../utils/logger')
const Room = require('../models/room');

const logSocketsInRoom = async (io, roomID) => {
  try {
    const clients = await io.in(roomID).allSockets();
    logger.info(`Sockets in room ${roomID}:`, Array.from(clients));
  } catch (error) {
    logger.error('Error:', error);
  }
};

const getUserData = async (room) => {
  const roomWithUserData = await Room.findOne({ 'pinCode': room.pinCode })
  .populate({
    path: 'players.user',
    select: 'username profilePicture'
  });

  const players = roomWithUserData.players.map((player) => ({
    user: {
      id: player.user._id,
      username: player.user.username,
      profilePicture: player.user.profilePicture
    }
  }));

  return players
}

const handleCreateRoom = async (io, socket, pinCode, userId) => {
  logger.info(`Player ${userId} created room with PIN code ${pinCode}`);

  const room = await Room.findOne({ 'pinCode': pinCode });

  if (!room) {
    logger.info("No room found")
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
  logger.info(`Player ${userId} joined room with PIN code ${pinCode}`);

  const room = await Room.findOne({ 'pinCode': pinCode });

  if (!room) {
    logger.info("No room found")
    return;
  }

  if (room.players.length === 12) {
    logger.info("Room if full.")
    return;
  }

  socket.pinCode = room.pinCode
  socket.userId = userId

  socket.join(room.pinCode);

  await logSocketsInRoom(io, room.pinCode);

  const playerIndex = room.players.findIndex((player) => player.user.toString() === userId);
  if (playerIndex === -1) {
    logger.info(`Player ${userId} is a new user.`);
    room.players.push({user: userId});
    await room.save();
  } else {
    logger.info(`Player ${userId} is already registered.`);
  }

  const players = await getUserData(room)

  logger.info("Sending playerJoined event")

  io.to(room.pinCode).emit('playerJoined', { players: players, numPlayers: players.length, createdBy: room.createdBy });
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
  
  const playerIndex = room.players.findIndex((player) => player.user.toString() === userId);
  if (playerIndex !== -1) {
    room.players.splice(playerIndex, 1);
    await room.save();
  }
  
  const players = await getUserData(room)

  logger.info("Sending playerLeft event")

  io.to(room.pinCode).emit('playerLeft', { players: players, numPlayers: players.length });
}

const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket ${socket.id} connected`);

    socket.on('createRoom', async (pinCode, userId) => {
      await handleCreateRoom(io, socket, pinCode, userId)
    });

    socket.on('joinRoom', async (pinCode, userId) => {
      await handleJoinRoom(io, socket, pinCode, userId)
    });

    socket.on('disconnecting', async() => {
      await handleDisconnection(io, socket)
    });
  });
};

module.exports = setupSocketEvents;
