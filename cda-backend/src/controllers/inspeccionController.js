const pool = require('../config/db');

// Registrar una nueva inspección con sus fotos
const crearInspeccion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { vehiculoId, inspectorId, estado, medidaDesgastePlato, medidaMordazas, resultadoEnd } = req.body;
    const archivos = req.files; 

    if (!vehiculoId || !inspectorId) {
      return res.status(400).json({ status: 'error', mensaje: 'El ID del vehículo y del inspector son obligatorios' });
    }

    await client.query('BEGIN'); // Transacción iniciada

    const insertInspeccion = `
      INSERT INTO inspecciones_quinta_rueda 
      (vehiculo_id, inspector_id, estado, medida_desgaste_plato, medida_mordazas, resultado_end) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, vehiculo_id AS "vehiculoId", inspector_id AS "inspectorId", estado, 
                medida_desgaste_plato AS "medidaDesgastePlato", medida_mordazas AS "medidaMordazas", 
                resultado_end AS "resultadoEnd", fecha_inspeccion AS "fechaInspeccion";
    `;
    const valInspeccion = [
      vehiculoId, 
      inspectorId, 
      estado || 'en_proceso', 
      medidaDesgastePlato ? parseFloat(medidaDesgastePlato) : null,
      medidaMordazas ? parseFloat(medidaMordazas) : null,
      resultadoEnd
    ];
    const resInspeccion = await client.query(insertInspeccion, valInspeccion);
    const nuevaInspeccion = resInspeccion.rows[0];

    let evidenciasAgregadas = [];
    if (archivos && archivos.length > 0) {
      const insertEvidencia = `
        INSERT INTO evidencias_fotograficas (inspeccion_id, tipo_foto, url_imagen) 
        VALUES ($1, $2, $3) 
        RETURNING id, inspeccion_id AS "inspeccionId", tipo_foto AS "tipoFoto", url_imagen AS "urlImagen", subido_en AS "subidoEn";
      `;
      for (const file of archivos) {
        const resEvidencia = await client.query(insertEvidencia, [
          nuevaInspeccion.id, 'general', `/uploads/${file.filename}`
        ]);
        evidenciasAgregadas.push(resEvidencia.rows[0]);
      }
    }

    const resVehiculo = await client.query('SELECT placa FROM vehiculos WHERE id = $1', [vehiculoId]);
    await client.query('COMMIT'); // Guardamos los cambios

    nuevaInspeccion.evidencias = evidenciasAgregadas;
    nuevaInspeccion.vehiculo = resVehiculo.rows[0];

    res.status(201).json({ status: 'success', data: nuevaInspeccion });

  } catch (error) {
    await client.query('ROLLBACK'); // Revertir todo si hay error
    console.error('Error al registrar inspección:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al registrar la inspección en pista' });
  } finally {
    client.release();
  }
};

// Obtener todas las inspecciones
const obtenerInspecciones = async (req, res) => {
  try {
    const consulta = `
      SELECT 
        i.id, i.vehiculo_id AS "vehiculoId", i.inspector_id AS "inspectorId", i.estado, 
        i.medida_desgaste_plato AS "medidaDesgastePlato", i.medida_mordazas AS "medidaMordazas", 
        i.resultado_end AS "resultadoEnd", i.fecha_inspeccion AS "fechaInspeccion",
        row_to_json(v_alias) as vehiculo,
        json_build_object('nombre', u.nombre) as inspector,
        COALESCE(
          (SELECT json_agg(e_alias) FROM (
             SELECT id, inspeccion_id AS "inspeccionId", tipo_foto AS "tipoFoto", url_imagen AS "urlImagen", subido_en AS "subidoEn" 
             FROM evidencias_fotograficas WHERE inspeccion_id = i.id
          ) e_alias), '[]'::json
        ) as evidencias,
        (SELECT row_to_json(c_alias) FROM (
           SELECT uuid_certificado AS "uuidCertificado", inspeccion_id AS "inspeccionId", fecha_emision AS "fechaEmision", fecha_vencimiento AS "fechaVencimiento", url_pdf AS "urlPdf", qr_codigo AS "qrCodigo"
           FROM certificados WHERE inspeccion_id = i.id
        ) c_alias) as certificado
      FROM inspecciones_quinta_rueda i
      LEFT JOIN (
        SELECT id, placa, cliente_id AS "clienteId", marca, modelo, tipo, creado_en AS "creadoEn" FROM vehiculos
      ) v_alias ON i.vehiculo_id = v_alias.id
      LEFT JOIN usuarios u ON i.inspector_id = u.id
      ORDER BY i.fecha_inspeccion DESC;
    `;
    const resultado = await pool.query(consulta);
    res.status(200).json({ status: 'success', data: resultado.rows });
  } catch (error) {
    console.error('Error al obtener inspecciones:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al cargar el historial de inspecciones' });
  }
};

module.exports = { crearInspeccion, obtenerInspecciones };