const mysql = require('mysql2/promise');

// const hostdb = 'containers-us-west-145.railway.app';
// const userdb = 'root';
// const passdb = 'SRGLy6fQXQmmq2isbnOA';
// const databasedb = 'railway';
// const portdb = 7680;

const hostdb = 'localhost';
const userdb = 'root';
const passdb = 'toor';
const databasedb = 'dbchat';

let connection;

export const connectDB = () => {
    if (connection) return Promise.resolve(connection);
  
    return mysql.createConnection({
      host: hostdb,
      user: userdb,
      password: passdb,
      database: databasedb
    })
    .then(conn => {
      connection = conn;
      return connection;
    })
    .catch(err => {
      console.error('No se pudo conectar a la base de datos:', err);
      throw err;
    });
  };