// passportConfig
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../config/dbConfig.js');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
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
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
      done(null, rows[0]);
    } catch (err) {
      done(err, null);
    }
  });
};