const { task, task_user_mapping } = require('../models')
const { sequelize } = require('../models');
const { Op } = require('sequelize');

exports.findTaskById = async (task_id) => {
    return task.findByPk(task_id);
}
exports.createTask = async (taskData, transaction) => {
    return task.create(taskData, { transaction })
}
exports.addTaskUsersMapping = async (taskId, userIds, transaction) => {
    const taskUserMappings = userIds.map(userId => ({ task_id: taskId, user_id: userId }));
    return task_user_mapping.bulkCreate(taskUserMappings, { transaction });
};
exports.deleteTaskUsersMapping = async (taskId, transaction) => {
    return task_user_mapping.destroy({ where: { task_id: taskId }, transaction });
};
exports.getIndividualTask = async (userId) => {
    return task.findAll({
        attributes: { exclude: ['updated_at', 'created_by'] },
        where: {
            created_by: userId,
            status: ['A', 'C'],
            group_task: false
        },
        order: [
            ['updated_at', 'DESC']
        ]
    });
};
// exports.getGroupTask = async (userId) => {
//     // const [results, metadata] = await sequelize.query(`select * from task_user_mappings tu
//     //     inner join tasks t on  tu.task_id=t.task_id
//     //     where tu.user_id=${userId} and t.group_task=true and t.status in ('A','C')`);
//     //     console.log(results,'res_group_task')
//     //     return results;

//     return task_user_mapping.findAll({

//         where: {
//             user_id: userId,
//         },
//         include: [{
//             model: task,
//             attributes: { exclude: ['updated_at', 'created_by'] },
//             where: {
//                 group_task: true,
//                 status: ['A', 'C'],
//             },
//             required: true,
//         }],
//     });
// };

// exports.getGroupTask = async (userId) => {
//     return task_user_mapping.findAll({
//         where: {
//             user_id: userId,
//         },
//         include: [{
//             model: task,
//             attributes: {
//                 include: [
//                     // Add the 'hasEditAccess' column as a literal value
//                     [sequelize.literal(`CASE WHEN task.created_by = ${userId} THEN 'Y' ELSE 'N' END`), 'hasEditAccess']
//                 ],
//                 exclude: ['updated_at', 'created_by'], // Exclude any fields you don't want in the result
//             },
//             where: {
//                 group_task: true,
//                 status: { [Op.in]: ['A', 'C'] }, // Use Op.in for array comparison
//             },
//             required: true,
//         }],
//     });
// };
exports.getGroupTask = async (userId) => {
    const query = `SELECT * FROM get_group_tasks_with_users(:userId)`;
    
    const results = await sequelize.query(query, {
        replacements: { userId }, 
        type: sequelize.QueryTypes.SELECT
    });

    return results;
};
exports.updateTask = async ({ task_id, task_title, task_description, task_deadline, updated_at },transaction) => {
    return task.update({ task_title, task_description, task_deadline, updated_at }, { where: { task_id },transaction })
}
exports.updateUserTaskStatus = async ({ task_id, user_id, updateData }, {transaction}) => {
    return task_user_mapping.update(updateData, { where: { task_id, user_id }, transaction })
}
exports.updateTaskStatus = async ({ task_id, updateData }, {transaction}) => {
    console.log(updateData, 'update')
    return task.update(updateData, { where: { task_id }, transaction })
}
exports.checkAllUsersCompleted = async (task_id, {transaction}) => {
    const totalUsers = await task_user_mapping.count({
        where: { task_id },
        transaction
    });
    const completedUsers = await task_user_mapping.count({
        where: { task_id, is_completed: true },
        transaction
    });
    return totalUsers > 0 && totalUsers === completedUsers;
};

