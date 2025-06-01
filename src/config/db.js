const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('DB_HOST in db.js:', process.env.DB_HOST);
console.log('DB_USER in db.js:', process.env.DB_USER);
console.log('DB_PASSWORD in db.js:', process.env.DB_PASSWORD);
console.log('DB_NAME in db.js:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;