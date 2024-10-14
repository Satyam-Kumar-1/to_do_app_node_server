'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task_user_mapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      task_user_mapping.belongsTo(models.task, { foreignKey: 'task_id' });
    }
  }
  task_user_mapping.init({
    task_user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    task_id: {
      type:DataTypes.NUMBER,
      allowNull:false,
      references:{
        model:'task',
        key:'task_id'
      }
    },
    user_id: {
      type:DataTypes.NUMBER,
      allowNull:false,
      references:{
        model:'user',
        key:'id'
      }
    },
    is_completed: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    completed_at: {
      type:DataTypes.DATE,
      allowNull:true,
    },
    
  }, {
    sequelize,
    timestamps: false, 
    modelName: 'task_user_mapping',
  });
  return task_user_mapping;
};