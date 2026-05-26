const pool = require('../config/db');

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const { tipoDocumento, numeroDocumento, nombreRazonSocial, telefono, correo } = req.body;

    if (!numeroDocumento || !nombreRazonSocial || !telefono) {
      return res.status(400).json({ status: 'error', mensaje: 'El documento, nombre y teléfono son obligatorios' });
    }

    const consulta = `
      INSERT INTO clientes (tipo_documento, numero_documento, nombre_razon_social, telefono, correo) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, tipo_documento AS "tipoDocumento", numero_documento AS "numeroDocumento", 
                nombre_razon_social AS "nombreRazonSocial", telefono, correo, creado_en AS "creadoEn";
    `;
    
    const resultado = await pool.query(consulta, [tipoDocumento, numeroDocumento, nombreRazonSocial, telefono, correo]);
    res.status(201).json({ status: 'success', data: resultado.rows[0] });

  } catch (error) {
    console.error('Error al crear cliente:', error);
    if (error.code === '23505') { 
      return res.status(409).json({ status: 'error', mensaje: 'Ya existe un cliente con ese número de documento' });
    }
    res.status(500).json({ status: 'error', mensaje: 'Error interno del servidor' });
  }
};

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const consulta = `
      SELECT id, tipo_documento AS "tipoDocumento", numero_documento AS "numeroDocumento", 
             nombre_razon_social AS "nombreRazonSocial", telefono, correo, creado_en AS "creadoEn" 
      FROM clientes ORDER BY creado_en DESC;
    `;
    const resultado = await pool.query(consulta);
    res.status(200).json({ status: 'success', data: resultado.rows });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al obtener la lista de clientes' });
  }
};

module.exports = { crearCliente, obtenerClientes };