const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../untils/db.js');

const User = sequelize.define('user', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  socketId:{
    type:DataTypes.STRING,
  },

}, {
    timestamps:true
});
module.exports=User