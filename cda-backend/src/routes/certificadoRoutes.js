const express = require('express');
const router = express.Router();

// Importamos ambas funciones desde el controlador
const { emitirCertificado, validarCertificado } = require('../controllers/certificadoController');

// Importamos a nuestros guardias para proteger solo la creación
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// RUTAS PROTEGIDAS (Solo ADMIN e INGENIERO)
router.post(
  '/', 
  verificarToken, 
  verificarRol(['ADMIN', 'INGENIERO']), 
  emitirCertificado
);

// RUTA PÚBLICA (Para el escaneo del Código QR)
router.get('/validar/:uuid', validarCertificado);

module.exports = router;