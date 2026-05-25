const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/usuarioController');

// POST a /api/usuarios/registro
router.post('/registro', registrarUsuario);

// POST a /api/usuarios/login
router.post('/login', loginUsuario);

module.exports = router;