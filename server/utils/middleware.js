const logger = require('./logger')

const omitSensitiveFields = (body) => {
  const sensitiveFields = ['password'];
  const cleanedBody = { ...body };

  sensitiveFields.forEach((field) => {
    if (cleanedBody.hasOwnProperty(field)) {
      cleanedBody[field] = '*****';
    }
  });

  return cleanedBody;
};

const requestLogger = (request, response, next) => {
  const cleanedBody = omitSensitiveFields(request.body);

  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', cleanedBody)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Error : This page doesn't exist"})
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}