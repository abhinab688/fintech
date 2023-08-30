const { createPool } = require('mysql2');
require('dotenv').config();

var pool = null;
function getDBPool() {
    if (pool && !pool._closed) return pool;

    //New production
    pool = createPool({
        connectTimeout: 1500,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 3306,
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0
    });

    return pool;
}

module.exports = getDBPool;