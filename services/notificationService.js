
const ErrorService = require('./errorService');
const { ClientError, CriticalError } = require('../errors/customError');
// Initialize Socket.IO instance
let ioInstance;

function initialize(socketIoInstance) {
  ioInstance = socketIoInstance;
}

function notifyGroupUsers(users, message) {
  // Send a general message to all users
  //ioInstance.emit('new-group-task', { message: `New group task created: ${message}` });

  // Send a specific message to each user
  users.forEach(async (userId) => {
    try {
      // Make sure userId is a string if you're joining with a string
      ioInstance.to(String(userId)).emit('new-group-task', { message });
    } catch (error) {
      console.error(`Error emitting to user ${userId}:`, error);
      // if (!(error instanceof ClientError) ) {
      //   await ErrorService.logError({
      //     message: error.message,
      //     stack: error.stack,
      //     errorCode: error.stack.split('\n')[1],
      //     timestamp: new Date(),
      //     user: userId ? userId : 'Guest',
      //     host: req.hostname,
      //     device: req.headers['user-agent'],
      //   });
      // }
    }
  });
}

// Export functions
module.exports = {
  initialize,
  notifyGroupUsers,
};