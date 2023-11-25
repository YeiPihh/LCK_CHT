// loginRoute
const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig.js');
const passport = require('passport');


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
            console.log(`Un nuevo usuario se ha logeado: ${req.body.username}`);
            return res.json({ succes: true, message: 'Logged in successfully' });
        });
    })(req, res, next);

    

});

module.exports = router;
