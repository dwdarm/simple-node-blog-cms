const sendNotFoundError = (res) => {
  res.status(404).send({
    status: 'error',
    message: 'Resource not found'
  });
}

const sendForbiddenError = (res) => {
  res.status(403).send({
    status: 'error',
    message: 'Forbidden access'
  });
}

const sendUnauthorizedError = (res) => {
  res.status(401).send({
    status: 'error',
    message: 'Unauthorized access'
  });
}

const sendInternalError = (res) => {
  res.status(500).send({
    status: 'error',
    message: 'Internal server error'
  });
}

const sendBadRequestError = (message = '') => (res) => {
  res.status(400).send({
    status: 'error',
    message
  });
}

module.exports = { 
  sendNotFoundError, 
  sendForbiddenError,
  sendUnauthorizedError,
  sendInternalError,
  sendBadRequestError
}
