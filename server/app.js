const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose');

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

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
