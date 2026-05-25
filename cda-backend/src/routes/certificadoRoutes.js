const express = require('express');
const router = express.Router();
const { emitirCertificado } = require('../controllers/certificadoController');

// Importamos a nuestros guardias
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// Protegemos la ruta:
// 1. Primero verifica que haya token
// 2. Luego verifica que el rol sea ADMIN o INGENIERO
// 3. Si todo está bien, ejecuta la emisión del certificado
router.post(
  '/', 
  verificarToken, 
  verificarRol(['ADMIN', 'INGENIERO']), 
  emitirCertificado
);

module.exports = router;