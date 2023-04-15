const { app, server } = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const {deleteAllRooms } = require('./controllers/rooms');


server.listen(config.PORT, async () => {
  logger.info(`Server running on port ${config.PORT}`);

  await deleteAllRooms();
  console.log("All rooms have been emptied.");
});