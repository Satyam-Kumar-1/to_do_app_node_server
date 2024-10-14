const userService = require('../services/userService');
exports.getAllUsers = async (req, res) => {

    try {
        const userId = req.user.id;
        const users = await userService.getAllUsers(userId);
        res.status(201).json({ users: users });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};