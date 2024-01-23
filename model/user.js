const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require()

const USer = sequelize.define('User',{
    username:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
});

module.exports = USer;