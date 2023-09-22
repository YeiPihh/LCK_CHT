var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var passport = require('passport');

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

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
            }
            return res.json({ message: 'Logged in successfully' });
        });
    })(req, res, next);

    console.log(`Un nuevo usuario se ha logeado: ${req.body.username}`);

});


module.exports = router;
