const express = require('express');
const router = express.Router();
const { crearCliente, obtenerClientes } = require('../controllers/clienteController');

// Definimos las rutas y las conectamos con las funciones del controlador
router.post('/', crearCliente);       // POST a /api/clientes
router.get('/', obtenerClientes);     // GET a /api/clientes

module.exports = router;