'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('errorlogs', 'ip_address', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('errorlogs', 'error_details', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('errorlogs', 'ip_address');
    await queryInterface.removeColumn('errorlogs', 'error_details');
  }
};
