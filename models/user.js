'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,     
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,  
    },
    createdat: {  
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedat: {  
      type: DataTypes.DATE,
      allowNull: false
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'user',
    timestamps: false,  
  });

  return User;
};
