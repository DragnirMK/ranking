const logger = require('../utils/logger')
const Room = require('../models/room');

const logSocketsInRoom = async (io, roomID) => {
  try {
    const clients = await io.in(roomID).allSockets();
    logger.info(`Sockets in room ${roomID}:`, Array.from(clients));
  } catch (error) {
    logger.info('Error:', error);
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
    },
    score: player.score,
    socketId: player.socketId
  }));

  return players
}

const handleCreateRoom = async (io, socket, pinCode, guestId) => {
  logger.info(`Player ${guestId} created room with PIN code ${pinCode}`);

  const room = await Room.findOne({ 'pinCode': pinCode });

  if (!room) {
    logger.info("No room found")
    return;
  }

  socket.join(room.pinCode);

  await logSocketsInRoom(io, room.pinCode);

  logger.info("Sending roomCreated event")

  io.to(room.pinCode).emit('roomCreated', { pinCode: pinCode });
}

const handleJoinRoom = async (io, socket, pinCode, guestId) => {
  logger.info(`Player ${guestId} joined room with PIN code ${pinCode}`);

  const room = await Room.findOne({ 'pinCode': pinCode });

  if (!room) {
    logger.info("No room found")
    return;
  }

  socket.join(room.pinCode);

  await logSocketsInRoom(io, room.pinCode);

  const playerIndex = room.players.findIndex((player) => player.user.toString() === guestId);
  if (playerIndex === -1) {
    logger.info(`Player ${guestId} is a new user.`);
    room.players.push({user: guestId, socketId: socket.id});
    await room.save();
  } else {
    logger.info(`Player ${guestId} is already registered.`);
    room.players[playerIndex].socketId = socket.id;
    await room.save();
  }

  const players = await getUserData(room)

  logger.info("Sending playerJoined event")

  io.to(room.pinCode).emit('playerJoined', { players: players, numPlayers: players.length });
}

const handleDisconnection = async (io, socket) => {
  logger.info('User disconnecting:', socket.id);

  const room = await Room.findOne({ 'players.socketId': socket.id });
  if (!room) {
    logger.info("No room found")
    return;
  }

  await logSocketsInRoom(io, room.pinCode);
  
  const playerIndex = room.players.findIndex((player) => player.socketId === socket.id);
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

    socket.on('createRoom', async (pinCode, guestId) => {
      await handleCreateRoom(io, socket, pinCode, guestId)
    });

    socket.on('joinRoom', async (pinCode, guestId) => {
      await handleJoinRoom(io, socket, pinCode, guestId)
    });

    socket.on('disconnecting', async() => {
      await handleDisconnection(io, socket)
    });
  });
};

module.exports = setupSocketEvents;
