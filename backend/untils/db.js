const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('whatsapp', 'root', 'ahmad327', {
    host: 'localhost',
    dialect:  'mysql',
},{logging: false
});

module.exports=sequelize;