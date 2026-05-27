const express = require('express');
const router = express.Router();

// 1. Importar todas las funciones del controlador
const { registrarUsuario, loginUsuario, obtenerUsuarios } = require('../controllers/usuarioController');

// 2. Importar los middlewares de seguridad
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// POST a /api/usuarios/registro
router.post('/registro', registrarUsuario);

// POST a /api/usuarios/login
router.post('/login', loginUsuario);

// --- NUEVA RUTA PROTEGIDA PARA LISTAR USUARIOS ---
router.get('/', verificarToken, verificarRol(['ADMIN', 'INGENIERO']), obtenerUsuarios);

module.exports = router;