const ErrorService = require('../services/errorService');

const errorMiddleware = async (err, req, res, next) => {
    const errorDetails = {
        errorCode: 'SERVER_ERROR',
        errorMessage: err.message,
        host: req.hostname,
        device: req.headers['user-agent'],
        user: req.user ? req.user.username : 'Unknown', // Adjust according to your auth logic
        stackTrace: err.stack,
    };

    await ErrorService.logError(errorDetails);
    res.status(500).json({ message: 'An error occurred' });
};

module.exports = errorMiddleware;
