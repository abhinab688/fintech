const Sequelize = require('sequelize');

const sequelize = new Sequelize('Fintech', 'root', 'Abhinab@123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;