const logger = require('../../utils/logger');
const Room = require('../../models/room');
const { hasEveryoneRated } = require('./utils');

const handleStartGame = async (io, pinCode, userId) => {
    logger.info(`Host ${userId} has started the game (Room PIN code ${pinCode})`);

    const room = await Room.findOne({ 'pinCode': pinCode });

    if (!room) {
        logger.info("No room found")
        return;
    }

    if (room.connectedUsers.length > 12) {
        logger.info("Too many people in the room")
        return;
    }

    room.players = room.players.concat(
        room.connectedUsers.map((connected) => ({
            user: connected.user
        }))
    );
      
    room.rates = room.rates.concat(
        room.connectedUsers.map((connected) => ({
            user: connected.user,
            videoRates: room.videos.map((_, index) => ({
            videoIndex: index,
            rate: -1
            }))
        }))
    );
    await room.save();

    logger.info("Sending gameStarted event")

    io.to(room.pinCode).emit('gameStarted');
}

const handleUpdateGameState = async (io, room) => {
    if (room.currentVideoIndex < room.videos.length - 1) {
        room.currentVideoIndex++;
        await room.save();

        logger.info("Sending nextVideo event")

        io.to(room.pinCode).emit('nextVideo', { 
            videoIndex: room.currentVideoIndex,
            videoTitle: room.videos[room.currentVideoIndex].title,
            videoURL: room.videos[room.currentVideoIndex].url
        });
    } else {
        const averageRatings = room.videos.map((_, index) => {
            const rates = room.rates
            .map((rate) => rate.videoRates.find((videoRate) => videoRate.videoIndex === index))
            .filter((videoRate) => videoRate && videoRate.rate !== -1)
            .map((videoRate) => videoRate.rate);

            const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
            return { videoIndex: index, average };
        });

        logger.info("Sending gameEnded event")

        io.to(room.pinCode).emit('gameEnded', { averageRatings });
    }
}

const handleFetchGameState = async (io, pinCode, userId) => {
    logger.info(`Player ${userId} fetch game state (Room PIN code ${pinCode})`);

    const room = await Room.findOne({ pinCode })
        .populate({
        path: 'players.user',
        select: 'username profilePicture',
        })
        .populate('createdBy')
        .populate('rates.user');

    if (!room) {
        logger.info("No room found");
        return;
    }

    logger.info("Sending gameState event")

    io.to(room.pinCode).emit('gameState', {
        pinCode,
        createdBy: room.createdBy,
        players: room.players,
        videoIndex: room.currentVideoIndex,
        videoTitle: room.videos[room.currentVideoIndex].title,
        videoURL: room.videos[room.currentVideoIndex].url,
        numVideos: room.videos.length,
    });
}

const handleRatingSubmitted = async (io, pinCode, userId, rating) => {
    logger.info(`Player ${userId} submitted a rate (Room PIN code ${pinCode})`);

    const room = await Room.findOne({ pinCode });

    if (!room) {
        logger.info("No room found");
        return;
    }

    const playerRates = room.rates.find((rates) => rates.user.toString() === userId);
    if (!playerRates) {
        logger.info("Invalid user");
        return;
    }

    const videoRate = playerRates.videoRates.find(
        (videoRate) => videoRate.videoIndex === room.currentVideoIndex
    );
    if (!videoRate) {
        logger.info("Invalid video")
        return;
    }

    videoRate.rate = rating;
    await room.save();

    logger.info("Sending playerRated event")

    io.to(room.pinCode).emit('playerRated', userId);

    const everyoneRated = await hasEveryoneRated(room)

    if (everyoneRated) {
        logger.info(`Everyone has given a rate for video index ${room.currentVideoIndex} (Room PIN code ${pinCode})`);

        await handleUpdateGameState(io, room)
    }
}

const handleSkipVideo = async (io, pinCode, userId) => {
    logger.info(`Host ${userId} has skipped the current video (Room PIN code ${pinCode})`);

    const room = await Room.findOne({ pinCode });

    if (!room) {
        logger.info("No room found");
        return;
    }

    await handleUpdateGameState(io, room)
}

module.exports = {
    handleStartGame, handleUpdateGameState, handleFetchGameState, handleRatingSubmitted, handleSkipVideo
}