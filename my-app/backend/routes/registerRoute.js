const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig.js'); // Usa la versión promisificada para async/await
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

router.post('/', [
    // Validación de los datos del usuario
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty()
], async function(req, res) {
    // Comprueba los resultados de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores de validación, envía una respuesta con los errores
        return res.status(400).json({ errors: errors.array() });
    }

    // Si los datos son válidos, intenta crear un nuevo usuario
    try {
        const { username, password } = req.body;
        
        // Comprueba si el usuario ya existe
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Crea un nuevo usuario y hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ msg: 'User registered successfully' });
        

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;