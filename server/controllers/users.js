const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger')

usersRouter.post('/login', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user
    ? await bcrypt.compare(body.password, user.password)
    : false;

    if (!user || !passwordCorrect) {
    return response.status(401).json({
        error: 'invalid username or password',
    });
    }

    response.status(200).send({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
    });
});

usersRouter.post('/signup', async (request, response) => {
    const body = request.body;
  
    const user = await User.findOne({ username: body.username });
  
    if (user) {
      return response.status(409).json({
        error: 'Username already exists',
      });
    }
  
    const saltRounds = 10;
  
    bcrypt.hash(body.password, saltRounds, async (err, hash) => {
      if (err) {
        logger.error(err.message);
        return response.status(500).send({
          error: 'Unable to create user at the moment',
        });
      }
  
      const user = new User({
        username: body.username,
        password: hash,
        profilePicture: body.profilePicture,
      });
  
      try {
        await user.save();
        response.status(201).send({
            message: 'User created.',
          });
      } catch (error) {
        logger.error(error.message);
        response.status(500).send({
          error: 'Unable to create user at the moment',
        });
      }
    });

});

module.exports = usersRouter;
