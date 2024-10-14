'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'task_deadline', {
      type: Sequelize.STRING(25),
      allowNull: true
    });

    await queryInterface.changeColumn('tasks', 'task_completion_date', {
      type: Sequelize.STRING(25),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'task_deadline', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.changeColumn('tasks', 'task_completion_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
