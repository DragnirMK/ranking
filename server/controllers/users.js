const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger')

usersRouter.post('/login', async (req, res) => {
    const body = req.body;

    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user
    ? await bcrypt.compare(body.password, user.password)
    : false;

    logger.info(user);
    logger.info(passwordCorrect);

    if (!user || !passwordCorrect) {
    return res.status(401).json({
        error: 'invalid username or password',
    });
    }

    res.status(200).send({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
    });
});

module.exports = usersRouter;
