const {  DataTypes } = require('sequelize');
const sequelize = require('../untils/db.js');
const moment=require('moment')
const Message = sequelize.define('message', {

  message:{
    type:DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    // defaultValue: moment.utc().format(),
    // allowNull: false,
  },
  updatedAt: {
    type:  DataTypes.DATE,
    // defaultValue: moment.utc(),
  }
  // sendId:{
  //   type:DataTypes.INTEGER,
  // },
  // receiveId:{
  //   type:DataTypes.INTEGER,
  // }
}, {
    timestamps:false
});
module.exports=Message