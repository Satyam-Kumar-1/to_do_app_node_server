const {user} = require('../models');
const { Op } = require('sequelize');

exports.findByEmail = async (email) => {
  return user.findOne({ where: { email } });
};

exports.createUser = async (userData) => {
  return user.create(userData);
};
exports.saveResetToken = async (id, resetToken, tokenExpiry) => {
  return user.update({reset_token:resetToken, token_expiry:tokenExpiry},{where:{id}})
};

exports.findResetToken = async (token) => {
  return user.findOne({ where: { reset_token:token } });
};

exports.updatePassword = async (id, password) => {
  return user.update({password},{where:{id}})
};

exports.invalidateResetToken = async (token) => {
  return user.update(
    { reset_token: null, token_expiry: null },
    { where: { reset_token: token } }
  );
};

exports.findValidUserIds = async (userIds) => {
  const validUsers = await user.findAll({
      where: {
          id: userIds
      },
      attributes: ['id']
  });
  
  return validUsers.map(user => user.id);
};

exports.getAllUsers=async(userId)=>{
  return user.findAll({
    attributes:{exclude:['password','createdat','updatedat','reset_token','token_expiry']},
    where:{
      id: {
      [Op.ne]: userId, 
    },}
  });
}