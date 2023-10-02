// passportConfig
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const hostdb = 'containers-us-west-145.railway.app';
const userdb = 'root';
const passdb = 'SRGLy6fQXQmmq2isbnOA';
const databasedb = 'railway';
const portdb = 7680;
// conexion a la base de datos
let connection;
mysql.createConnection({
  host: hostdb,
  user: userdb,
  password: passdb,
  database: databasedb,
  port: portdb
}).then(conn => {
    connection = conn;
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
          const user = rows[0];
          if (await bcrypt.compare(password, user.password)) { // Verifica el hash
            return done(null, user);
          } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
        } else {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
      done(null, rows[0]);
    } catch (err) {
      done(err, null);
    }
  });
};