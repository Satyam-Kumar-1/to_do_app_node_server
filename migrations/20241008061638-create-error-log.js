'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('errorlogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timestamp: {
        type: Sequelize.DATE
      },
      error_code: {
        type: Sequelize.STRING
      },
      error_message: {
        type: Sequelize.STRING
      },
      host: {
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.STRING
      },
      stack_trace: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('errorlogs');
  }
};