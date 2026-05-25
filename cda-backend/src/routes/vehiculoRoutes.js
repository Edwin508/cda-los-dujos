const express = require('express');
const router = express.Router();
const { crearVehiculo, obtenerVehiculos, obtenerVehiculosDeCliente } = require('../controllers/vehiculoController');

router.post('/', crearVehiculo);
router.get('/', obtenerVehiculos);
router.get('/cliente/:clienteId', obtenerVehiculosDeCliente);

module.exports = router;