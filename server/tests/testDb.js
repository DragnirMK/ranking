const config = require('../utils/config');
const mongoose = require('mongoose');
const logger = require('../utils/logger')
const Room = require('../models/room');
const User = require('../models/user')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

async function asyncCall() {
    const ids = ['', '', '']
    const users = await User.find({ '_id': { $in: ids } }, { password: 0 });
    console.log(users);
}
  
asyncCall();
