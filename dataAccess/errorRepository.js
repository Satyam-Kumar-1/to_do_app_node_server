const { errorlog } = require('../models'); // Ensure you import the correct model

exports.createErrorLog = async (errorData) => {
    return await errorlog.create({
        timestamp: errorData.timestamp,
        error_code: errorData.errorCode, 
        error_message: errorData.errorMessage, 
        ip_address:errorData.ip_address,
        host: errorData.host,
        device: errorData.device,
        user: errorData.user,
        stack_trace: errorData.stackTrace, 
    });
};
