'use strict';
const {
  Model,
  DataTypes,
  Sequelize // Ensure Sequelize is imported
} = require('sequelize');

module.exports = (sequelize) => {
  class ErrorLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
    }
  }

  ErrorLog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    error_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stack_trace: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'), // Use Sequelize.fn
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'), // Use Sequelize.fn
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    error_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'errorlogs', // Ensure the correct table name is used
    timestamps: false, // No automatic timestamps
    modelName: 'errorlog', // Use PascalCase for modelName
  });

  return ErrorLog;
};
