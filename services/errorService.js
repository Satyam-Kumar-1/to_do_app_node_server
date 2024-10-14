// services/errorService.js
const logger = require('../config/winston');
const ErrorRepository = require('../dataAccess/errorRepository');

exports.logError = async (errorDetails) => {
    // Log to file
    logger.error(errorDetails);

    // Save to PostgreSQL using the repository
    try {
        await ErrorRepository.createErrorLog({
            timestamp: errorDetails.timestamp,
            errorCode: errorDetails.errorCode,
            errorMessage: errorDetails.message,
            ip_address: errorDetails.ip_address,
            host: errorDetails.host,
            device: errorDetails.device,
            user: errorDetails.user,
            stackTrace: errorDetails.stack,
        });
    } catch (dbError) {
        logger.error(dbError);
        console.error('Failed to log error to database:', dbError);
    }
};
