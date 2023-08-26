const Sequelize = require('sequelize');

const sequelize = require('../Model/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    password: Sequelize.STRING
});

module.exports = User;