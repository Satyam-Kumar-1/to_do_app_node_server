'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_user_mappings', {
      task_user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tasks',  
          key: 'task_id'        
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  
          key: 'id'        
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_user_mappings');
  }
};