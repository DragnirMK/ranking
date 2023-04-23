const logger = require('../utils/logger')
const roomsRouter = require('express').Router();
const Room = require('../models/room');

const deleteAllRooms = async () => {
  return await Room.deleteMany({});
};

roomsRouter.post('/', async (request, response) => {
  const { videos, createdBy } = request.body;
  const pinCode = Math.floor(1000 + Math.random() * 9000);

  const newRoom = new Room({
    videos,
    pinCode,
    createdBy
  });

  try {
    const savedRoom = await newRoom.save();
    response.json({ ...savedRoom.toJSON(), id: savedRoom._id });
  } catch (error) {
    logger.error('Error creating game:', error);
    response.status(500).send({ error: 'Error creating game' });
  }
});


roomsRouter.get('/', async (request, response) => {
  try {
    const rooms = await Room.find();
    response.json(rooms);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Server Error');
  }
});

roomsRouter.get('/:pinCode', async (request, response) => {
  const { pinCode } = request.params;

  try {
    let room = await Room.findOne({ 'pinCode': pinCode }).populate('players.user', { password: 0 });
    const roomObject = room.toObject();

    roomObject.players = roomObject.players.map((player) => ({
      user: {
          id: player.user._id,
          username: player.user.username,
          profilePicture: player.user.profilePicture
      }
    }));
    logger.info(roomObject.players)
    response.json(roomObject);
  } catch (error) {
    logger.error('Error getting game:', error);
    response.status(500).send({ error: 'Error getting game' });
  }
});

module.exports = { roomsRouter, deleteAllRooms };
