const prisma = require('../config/db');

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    // Extraemos los datos que nos envían desde el frontend (o Postman)
    const { tipoDocumento, numeroDocumento, nombreRazonSocial, telefono, correo } = req.body;

    // Validación básica
    if (!numeroDocumento || !nombreRazonSocial || !telefono) {
      return res.status(400).json({ 
        status: 'error', 
        mensaje: 'El documento, nombre y teléfono son obligatorios' 
      });
    }

    // Le pedimos a Prisma que cree el registro en Neon
    const nuevoCliente = await prisma.cliente.create({
      data: {
        tipoDocumento,
        numeroDocumento,
        nombreRazonSocial,
        telefono,
        correo
      }
    });

    res.status(201).json({ status: 'success', data: nuevoCliente });

  } catch (error) {
    console.error('Error al crear cliente:', error);
    // Prisma arroja el código P2002 cuando intentas registrar un dato @unique que ya existe (ej. la cédula)
    if (error.code === 'P2002') {
      return res.status(409).json({ status: 'error', mensaje: 'Ya existe un cliente con ese número de documento' });
    }
    res.status(500).json({ status: 'error', mensaje: 'Error interno del servidor' });
  }
};

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { creadoEn: 'desc' } // Los ordenamos del más reciente al más antiguo
    });
    
    res.status(200).json({ status: 'success', data: clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al obtener la lista de clientes' });
  }
};

module.exports = {
  crearCliente,
  obtenerClientes
};