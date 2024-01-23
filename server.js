const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('restaurant', 'root', 'navya@2018', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;