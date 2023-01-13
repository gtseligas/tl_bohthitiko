const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    user: 'root',
    password: 'valte ton kodiko ths mysql edo !!11!!!1!!1',
    host: 'localhost',
    port: 3306,
    database: 'tlproject'
});

module.exports = pool;