const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

const hostdb = DB_HOST;
const userdb = DB_USER;
const passdb = DB_PASS;
const databasedb = DB_NAME;
const portdb = DB_PORT;

const pool = mysql.createPool({
  host: hostdb,
  user: userdb,
  password: passdb,
  database: databasedb,
  port: portdb,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;