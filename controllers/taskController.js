const taskService = require('../services/taskService');
const { ClientError, CriticalError } = require('../errors/customError');

exports.addTask = async (req, res) => {
    try {
        const { task_type, task_title, task_desc, task_deadline, task_users } = req.body;
        const userId = req.user.id;
        if (!task_type || task_type.trim() === '') {
            return res.status(400).json({ error: 'Task Type is required.' });
        }
        if (!task_title || task_title.trim() === '') {
            return res.status(400).json({ error: 'Task title is required.' });
        }
        const task = await taskService.addTask({ req, task_type, task_title, task_description: task_desc, task_deadline, created_by: userId, task_users });
        res.status(201).json({ message: 'Task Added Successfully' });
    }
    catch (error) {
        if (error instanceof ClientError) {
            res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An internal error occurred' });
    }
};
exports.getAllIndividualTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const task_list = await taskService.getAllIndividualTask(req, userId);
        res.status(201).json({ task_list: task_list });
    }
    catch (error) {
        if (error instanceof ClientError) {
            res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An internal error occurred' });
    }
};
exports.getAllGroupTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const task_list = await taskService.getAllGroupTask(req, userId);
        res.status(201).json({ task_list: task_list });
    }
    catch (error) {
        if (error instanceof ClientError) {
            res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An internal error occurred' });
    }
};
exports.updateTask = async (req, res) => {
    try {
        const task_id = req.params.taskId;
        const userId = req.user.id;
        const { task_title, task_desc, task_deadline, task_users } = req.body;

        if (!task_id) {
            res.status(400).json({ error: 'Invalid Task' });
        }
        if (!task_title || task_title.trim() === '') {
            return res.status(400).json({ error: 'Task title is required.' });
        }
        const task = await taskService.updateTask({ req, task_id, task_title, task_description: task_desc, task_deadline, task_users, userId });

        res.status(201).json({ message: 'Task Updated Successfully' });
    }
    catch (error) {
        if (error instanceof ClientError) {
            res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An internal error occurred' });
    }
};
exports.updateTaskStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const task_id = req.params.taskId;
        const { status } = req.body;

        if (!task_id) {
            return res.status(401).json({ error: 'Invalid Task' });
        }

        if (!status || status.trim() === '') {
            return res.status(400).json({ error: 'Status is required.' });
        }

        const response = await taskService.updateTaskStatus({ req, task_id, status, userId });

        if (response.message) {
            return res.status(200).json({ message: response.message });
        }
        res.status(201).json({ message: 'Task Status Updated Successfully' });
    } catch (error) {

        if (error instanceof ClientError) {
            res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An internal error occurred' });
    }
};
