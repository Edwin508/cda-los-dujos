const prisma = require('../config/db');

// Crear un nuevo vehículo
const crearVehiculo = async (req, res) => {
  try {
    const { placa, clienteId, marca, modelo, tipo } = req.body;

    // Validación básica
    if (!placa || !tipo) {
      return res.status(400).json({ 
        status: 'error', 
        mensaje: 'La placa y el tipo de vehículo son obligatorios' 
      });
    }

    const nuevoVehiculo = await prisma.vehiculo.create({
      data: {
        placa: placa.toUpperCase(), // Forzamos mayúsculas para evitar duplicados como "abc-123" y "ABC-123"
        clienteId,
        marca,
        modelo,
        tipo
      }
    });

    res.status(201).json({ status: 'success', data: nuevoVehiculo });

  } catch (error) {
    console.error('Error al crear vehículo:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ status: 'error', mensaje: 'Esta placa ya se encuentra registrada' });
    }
    res.status(500).json({ status: 'error', mensaje: 'Error interno del servidor' });
  }
};

// Obtener todos los vehículos
const obtenerVehiculos = async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      include: {
        cliente: true // Esto es la magia de Prisma: trae automáticamente los datos del dueño
      },
      orderBy: { creadoEn: 'desc' }
    });
    
    res.status(200).json({ status: 'success', data: vehiculos });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al obtener la lista de vehículos' });
  }
};

// Obtener vehículos por ID de Cliente
const obtenerVehiculosDeCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const vehiculos = await prisma.vehiculo.findMany({
      where: { clienteId }
    });
    
    res.status(200).json({ status: 'success', data: vehiculos });
  } catch (error) {
    console.error('Error al buscar vehículos del cliente:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al realizar la búsqueda' });
  }
};

module.exports = {
  crearVehiculo,
  obtenerVehiculos,
  obtenerVehiculosDeCliente
};