'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      task.belongsTo(models.user, { foreignKey: 'created_by' });
    }
  }
  task.init({
    task_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    task_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    task_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    task_deadline: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    task_completion_date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',  
        key: 'id'        
      }
    },
    group_task: {
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
  }, {
    sequelize,
    modelName: 'task',
    tableName: 'tasks',  
    timestamps: false,  
    underscored: true
  });
  return task;
};
