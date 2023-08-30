// const Sequelize = require('sequelize');

// const dotenv = require('dotenv');
// dotenv.config()

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     dialect: 'mysql',
//     host: process.env.DB_HOST
// });

// module.exports = sequelize;


const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'fintech',
    password: 'Abhinab@123',
});
connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to MySql Database: ' + err.stack);
        return;
    }
    console.log('Connected as id' + connection.threadId);
});
module.exports = connection.promise();
