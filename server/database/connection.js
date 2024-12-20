const mysql = require('mysql2');

const DB_HOST =process.env.DB_HOST || 'localhost'
const DB_USER =process.env.DB_USER || 'root'
const DB_PASSWORD =process.env.DB_PASSWORD || ''
const DB_PORT =process.env.DB_PORT || 3307
const DB_NAME =process.env.DB_NAME || 'db_game'

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
});

module.exports = db;
