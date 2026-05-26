const pool = require('../config/db');

// Crear un nuevo vehículo
const crearVehiculo = async (req, res) => {
  try {
    const { placa, clienteId, marca, modelo, tipo } = req.body;

    if (!placa || !tipo) {
      return res.status(400).json({ status: 'error', mensaje: 'La placa y el tipo de vehículo son obligatorios' });
    }

    const consulta = `
      INSERT INTO vehiculos (placa, cliente_id, marca, modelo, tipo) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, placa, cliente_id AS "clienteId", marca, modelo, tipo, creado_en AS "creadoEn";
    `;
    const valores = [placa.toUpperCase(), clienteId, marca, modelo, tipo];
    
    const resultado = await pool.query(consulta, valores);
    res.status(201).json({ status: 'success', data: resultado.rows[0] });

  } catch (error) {
    console.error('Error al crear vehículo:', error);
    if (error.code === '23505') {
      return res.status(409).json({ status: 'error', mensaje: 'Esta placa ya se encuentra registrada' });
    }
    res.status(500).json({ status: 'error', mensaje: 'Error interno del servidor' });
  }
};

// Obtener todos los vehículos
const obtenerVehiculos = async (req, res) => {
  try {
    // Retornamos la misma estructura anidada que devolvía Prisma
    const consulta = `
      SELECT 
        v.id, v.placa, v.cliente_id AS "clienteId", v.marca, v.modelo, v.tipo, v.creado_en AS "creadoEn",
        row_to_json(c_alias) as cliente 
      FROM vehiculos v 
      LEFT JOIN (
        SELECT id, tipo_documento AS "tipoDocumento", numero_documento AS "numeroDocumento", 
               nombre_razon_social AS "nombreRazonSocial", telefono, correo, creado_en AS "creadoEn" 
        FROM clientes
      ) c_alias ON v.cliente_id = c_alias.id 
      ORDER BY v.creado_en DESC;
    `;
    const resultado = await pool.query(consulta);
    res.status(200).json({ status: 'success', data: resultado.rows });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al obtener la lista de vehículos' });
  }
};

// Obtener vehículos por ID de Cliente
const obtenerVehiculosDeCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const consulta = `
      SELECT id, placa, cliente_id AS "clienteId", marca, modelo, tipo, creado_en AS "creadoEn" 
      FROM vehiculos WHERE cliente_id = $1;
    `;
    const resultado = await pool.query(consulta, [clienteId]);
    res.status(200).json({ status: 'success', data: resultado.rows });
  } catch (error) {
    console.error('Error al buscar vehículos del cliente:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al realizar la búsqueda' });
  }
};

module.exports = { crearVehiculo, obtenerVehiculos, obtenerVehiculosDeCliente };