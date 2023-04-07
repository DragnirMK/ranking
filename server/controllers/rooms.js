const logger = require('../utils/logger')
const roomsRouter = require('express').Router();
const Room = require('../models/room');

roomsRouter.post('/create-room', async (request, response) => {
  const { rows, createdBy, socketId } = request.body;
  const pinCode = Math.floor(1000 + Math.random() * 9000);

  const newRoom = new Room({
    rows,
    pinCode,
    createdBy,
    players: [{ user: createdBy, socketId }],
  });

  try {
    const savedRoom = await newRoom.save();
    response.json({ ...savedRoom.toJSON(), id: savedRoom._id });
  } catch (error) {
    console.error('Error creating game:', error);
    response.status(500).send({ error: 'Error creating game' });
  }
});

roomsRouter.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

roomsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const room = await Room.findById(id).populate('players.user', { username: 1, profilePicture: 1 });
    response.json(room.toJSON());
  } catch (error) {
    console.error('Error getting game:', error);
    response.status(500).send({ error: 'Error getting game' });
  }
});

module.exports = roomsRouter;
