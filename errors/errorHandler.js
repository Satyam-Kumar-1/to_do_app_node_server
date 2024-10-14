
const ErrorService = require('../services/errorService');
const { getIPV4Adress } = require('../utils/getIpAddress');
const { ClientError } = require('./customError');

async function handleError(req, error) {
  if (!(error instanceof ClientError)) {
    await ErrorService.logError({
      message: error.message,
      stack: error.stack,
      errorCode: error.stack.split('\n')[1],
      timestamp: new Date(),
      user: req.user ? req.user.email : 'Guest',
      host: req.hostname,
      ip_address:getIPV4Adress(req),
      device: req.headers['user-agent'],
    });
  }
  throw error; 
}

module.exports = { handleError };
