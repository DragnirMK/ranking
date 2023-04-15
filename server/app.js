const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const setupSocketEvents = require('./controllers/sockets');

const usersRouter = require('./controllers/users');
const { roomsRouter } = require('./controllers/rooms');
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});
setupSocketEvents(io);

console.log('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.use('/api/users', usersRouter);
app.use('/api/rooms', roomsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = { app, server };
