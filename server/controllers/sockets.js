const logger = require('../utils/logger')
const Room = require('../models/room');

const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket ${socket.id} connected`);

    socket.on('joinRoom', async (pinCode, guestId) => {
      logger.info(`Player ${guestId} joined room with PIN code ${pinCode}`);
    
      socket.join(pinCode);
    
      const room = await Room.findOne({ 'pinCode': pinCode });

      if (!room) {
        logger.info("No room found")
        return;
      }
    
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

      // Get user data
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
    
      io.to(pinCode).emit('playerJoined', { players: players, numPlayers: players.length });    
    });    

    socket.on('disconnect', async() => {
      logger.info('User disconnected:', socket.id);

      const room = await Room.findOne({ 'players.socketId': socket.id });
      if (!room) {
        logger.info("No room found")
        return;
      }
      
      const playerIndex = room.players.findIndex((player) => player.socketId === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        await room.save();
      }
      
      // Get user data
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

      io.to(room.pinCode).emit('playerLeft', { players: players, numPlayers: players.length });
    });
  });
};

module.exports = setupSocketEvents;
