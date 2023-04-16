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
    createdBy,
    connectedUsers: [{ user: createdBy }]
  });

  try {
    const savedRoom = await newRoom.save();
    response.json({ ...savedRoom.toJSON(), id: savedRoom._id });
  } catch (error) {
    logger.error('Error creating game:', error);
    response.status(500).send({ error: 'Error creating game' });
  }
});


roomsRouter.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Server Error');
  }
});

roomsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const room = await Room.findById(id).populate('connectedUsers.user', { username: 1, profilePicture: 1 });
    response.json(room.toJSON());
  } catch (error) {
    logger.error('Error getting game:', error);
    response.status(500).send({ error: 'Error getting game' });
  }
});

module.exports = { roomsRouter, deleteAllRooms };
