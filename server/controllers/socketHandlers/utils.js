const logger = require('../../utils/logger');
const User = require('../../models/user')
const Room = require('../../models/room');

const logSocketsInRoom = async (io, pinCode) => {
    try {
        const sockets = await io.in(pinCode).allSockets();
        logger.info(`Sockets in room ${pinCode}:`, Array.from(sockets));
    } catch (error) {
        logger.error('Error:', error);
    }
};

const getConnectedUsersData = async (io, pinCode) => {
    const sockets = await io.in(pinCode).fetchSockets();
    const ids = sockets.map((socket) => socket.userId)

    logger.info("Connected users : ");
    logger.info(ids);

    const connectedUsers = (await User.find({ '_id': { $in: ids } }, { password: 0 })).map((connected) => ({
        user: {
            id: connected._id,
            username: connected.username,
            profilePicture: connected.profilePicture
        }
    }));

    return connectedUsers
}

const hasEveryoneRated = async (io, room) => {
    const sockets = await io.in(room.pinCode).fetchSockets();
    const ids = sockets.map((socket) => socket.userId)

    logger.info("Connected users : ");
    logger.info(ids);

    return ids.every((userId) => {
        const userRate = room.rates.find((rate) => rate.user.toString() === userId);
        if (!userRate) {
            return false;
        }

        const videoRate = userRate.videoRates.find(
            (videoRate) => videoRate.videoIndex === room.currentVideoIndex
        );
        if (!videoRate) {
            return false;
        }

        logger.info("User rate :");
        logger.info(videoRate.rate);

        return videoRate.rate !== -1;
    });
};

module.exports = {
    logSocketsInRoom, getConnectedUsersData, hasEveryoneRated
}