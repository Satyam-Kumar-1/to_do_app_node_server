const taskRepository = require('../dataAccess/taskRepository')
const userRepository = require('../dataAccess/userRepository')
const { format } = require('date-fns');
const { sequelize } = require('../models');
const { notifyGroupUsers } = require('./notificationService');
const ErrorService = require('./errorService');
const { ClientError, CriticalError } = require('../errors/customError');
const { handleError } = require('../errors/errorHandler');

exports.addTask = async ({ req, task_type, task_title, task_description, task_deadline, created_by, task_users }) => {
    const currDate = new Date();
    const is_group_task = task_type === "G";
    const transaction = await sequelize.transaction();
    let validUserIds;
    try {
        const task = await taskRepository.createTask({
            task_title,
            task_description,
            task_deadline,
            created_at: currDate,
            updated_at: currDate,
            created_by,
            status: 'A',
            group_task: is_group_task
        }, transaction);

        if (is_group_task) {
            let userIds = [];
            if (task_users && task_users.length) {
                userIds = task_users.split(',').map(user => user.trim());
            }
            const currentUserId = created_by;
            userIds = [...new Set(userIds)].filter(userId => userId !== currentUserId);
            userIds.push(currentUserId);

            validUserIds = await userRepository.findValidUserIds(userIds);
            if (validUserIds.length !== userIds.length) {
                throw new ClientError('One or more user IDs are invalid.', 400);
            }

            await taskRepository.addTaskUsersMapping(task.task_id, validUserIds, transaction);
        }

        await transaction.commit();

        if (is_group_task) {
            // Remove created_by from validUserIds before sending notification
            const groupUsersToNotify = validUserIds.filter(userId => userId !== created_by);
            notifyGroupUsers(groupUsersToNotify, `A new group task "${task_title}" has been created.`);
        }

        return task;
    } catch (error) {
        await transaction.rollback();
        await handleError(req, error);
    }
};

exports.getAllIndividualTask = async (req, userId) => {
    try {
        const currDate = new Date();
        const task = await taskRepository.getIndividualTask(userId)
        return task;
    } catch (error) {
        await handleError(req, error);
    }
}
exports.getAllGroupTask = async (req, userId) => {
    try {
        const currDate = new Date();
        const task = await taskRepository.getGroupTask(userId)
        return task;
    } catch (error) {

        await handleError(req, error);
    }
}
exports.updateTask = async ({ req, task_title, task_description, task_deadline, task_id, task_users, userId }) => {
    const existingTask = await taskRepository.findTaskById(task_id);
    if (!existingTask) {
        throw new ClientError('Task not found');
    }
    if (existingTask.created_by !== userId) {
        throw new ClientError(`You don't have access to update this Task`);
    }
    if (existingTask.status === 'H' || existingTask.status === 'C') {
        throw new ClientError('You cannot update this Task');
    }
    const currDate = new Date();

    const transaction = await sequelize.transaction();
    try {
        const task = await taskRepository.updateTask({ task_id, task_title, task_description, task_deadline, updated_at: currDate }, transaction)

        if (existingTask.group_task) {
            await handleTaskUsersMapping(existingTask.task_id, task_users, userId, transaction);
        }
        await transaction.commit();
        return task;
    }
    catch (error) {
        transaction.rollback();
        await handleError(req, error);
    }
}

async function handleTaskUsersMapping(task_id, task_users, userId, transaction) {
    let userIds = [];

    if (task_users && task_users.length) {
        userIds = task_users.split(',').map(user => user.trim());
    }
    userIds.push(userId);
    const validUserIds = await userRepository.findValidUserIds(userIds);
    if (validUserIds.length !== userIds.length) {
        throw new ClientError('One or more user IDs are invalid.');
    }
    await taskRepository.deleteTaskUsersMapping(task_id, transaction);
    await taskRepository.addTaskUsersMapping(task_id, validUserIds, transaction);
}
exports.updateTaskStatus = async ({ req, task_id, status, userId }) => {
    const transaction = await sequelize.transaction();
    try {
        const existingTask = await taskRepository.findTaskById(task_id);
        if (!existingTask) {
            throw new ClientError('Task not found');
        }
        const { created_by, group_task, status: currentStatus } = existingTask;
        if (!group_task && created_by !== userId) {
            throw new ClientError('You are not authorized to update this task');
        }
        if (currentStatus === 'H' || currentStatus === 'C') {
            if (status === 'C' && currentStatus === 'C') {
                return { message: 'Task is already completed.' };
            }
            throw new ClientError('You cannot update status');
        }
        if (currentStatus === 'A') {
            const updateData = { status };
            if (status === 'C') {
                updateData.task_completion_date = format(new Date(), 'yyyy-MM-dd');
                if (group_task) {
                    await taskRepository.updateUserTaskStatus({
                        task_id,
                        user_id: userId,
                        updateData: {
                            is_completed: true,
                            completed_at: updateData.task_completion_date
                        }
                    }, { transaction });

                    const allUsersCompleted = await taskRepository.checkAllUsersCompleted(task_id, { transaction });
                    if (allUsersCompleted) {
                        updateData.status = 'C';
                    }
                }
            } else if (status === 'H' && userId !== created_by) {
                throw new ClientError('You are not authorized to update this task');
            }

            const updatedTask = await taskRepository.updateTaskStatus({ task_id, updateData }, { transaction });

            await transaction.commit();
            return {
                message: status === 'H' ? 'Task Deleted Successfully' : 'Task Status Updated Successfully',
                task: updatedTask
            };
        }

        throw new ClientError('Invalid status update');

    } catch (error) {
        await transaction.rollback();
        await handleError(req, error);
    }
};


