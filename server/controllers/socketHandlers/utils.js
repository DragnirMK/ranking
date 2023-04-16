const logger = require('../../utils/logger');
const Room = require('../../models/room');

const logSocketsInRoom = async (io, roomID) => {
    try {
        const clients = await io.in(roomID).allSockets();
        logger.info(`Sockets in room ${roomID}:`, Array.from(clients));
    } catch (error) {
        logger.error('Error:', error);
    }
};

const getConnectedUsersData = async (room) => {
    const roomWithUserData = await Room.findOne({ 'pinCode': room.pinCode })
    .populate({
        path: 'connectedUsers.user',
        select: 'username profilePicture'
    });

    const connectedUsers = roomWithUserData.connectedUsers.map((connected) => ({
        user: {
            id: connected.user._id,
            username: connected.user.username,
            profilePicture: connected.user.profilePicture
        }
    }));

    return connectedUsers
}

const hasEveryoneRated = async (room) => {
    const connectedUserIds = room.connectedUsers.map((connected) => connected.user.toString());

    logger.info("Connected users : ");
    logger.info(connectedUserIds);

    return connectedUserIds.every((userId) => {
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