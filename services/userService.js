const userRepository = require('../dataAccess/userRepository')
exports.getAllUsers = async (userId) => {
    try {
        const users = await userRepository.getAllUsers(userId);
        return users;
    }
    catch (error) {
        throw error;
    }
}