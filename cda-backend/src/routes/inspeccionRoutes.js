const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // Importamos Multer
const { crearInspeccion, obtenerInspecciones } = require('../controllers/inspeccionController');

// OJO AL MIDDLEWARE: upload.array('fotos', 10) 
// Esto permite subir hasta 10 imágenes a la vez. El frontend DEBE llamar a este campo "fotos".
router.post('/', upload.array('fotos', 10), crearInspeccion);
router.get('/', obtenerInspecciones);

module.exports = router;