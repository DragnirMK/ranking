const logger = require('../utils/logger')
const { handleCreateRoom, handleJoinRoom, handleDisconnection } = require('./socketHandlers/roomHandlers');
const { handleStartGame, handleFetchGameState, handleRatingSubmitted, handleSkipVideo } = require('./socketHandlers/gameHandlers');

const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket ${socket.id} connected`);

    socket.on('createRoom', async (pinCode, userId) => {
      await handleCreateRoom(io, socket, pinCode, userId)
    });

    socket.on('joinRoom', async (pinCode, userId) => {
      await handleJoinRoom(io, socket, pinCode, userId)
    });

    socket.on('startGame', async (pinCode, userId) => {
      await handleStartGame(io, pinCode, userId)
    });

    socket.on('fetchGameState', async (pinCode, userId) => {
      await handleFetchGameState(io, pinCode, userId);
    });
  
    socket.on('ratingSubmitted', async (pinCode, userId, rating ) => {
      await handleRatingSubmitted(io, pinCode, userId, rating);
    });
  
    socket.on('skipVideo', async (pinCode, userId) => {
      await handleSkipVideo(io, pinCode, userId);
    });

    socket.on('disconnecting', async() => {
      await handleDisconnection(io, socket)
    });
  });
}

module.exports = setupSocketEvents;
