const pool = require('../config/db');
const { generarCertificadoPDF } = require('../services/certificadoService');

const emitirCertificado = async (req, res) => {
  try {
    const { inspeccionId, resultadoFinal } = req.body;

    if (!inspeccionId || !resultadoFinal) {
      return res.status(400).json({ status: 'error', mensaje: 'Faltan datos o el resultado final' });
    }

    // 1. Buscamos la inspección
    const queryInspeccion = `
      SELECT 
        i.id, i.estado,
        row_to_json(v_alias) as vehiculo,
        row_to_json(c_alias) as certificado
      FROM inspecciones_quinta_rueda i
      LEFT JOIN (SELECT id, placa FROM vehiculos) v_alias ON i.vehiculo_id = v_alias.id
      LEFT JOIN (SELECT uuid_certificado, inspeccion_id FROM certificados) c_alias ON c_alias.inspeccion_id = i.id
      WHERE i.id = $1;
    `;
    const resInspeccion = await pool.query(queryInspeccion, [inspeccionId]);
    const inspeccion = resInspeccion.rows[0];

    if (!inspeccion) {
      return res.status(404).json({ status: 'error', mensaje: 'Inspección no encontrada' });
    }
    if (inspeccion.certificado) {
      return res.status(400).json({ status: 'error', mensaje: 'Esta inspección ya tiene un certificado emitido' });
    }

    // 2. Actualizamos el estado de la inspección en la base de datos
    await pool.query('UPDATE inspecciones_quinta_rueda SET estado = $1 WHERE id = $2', [resultadoFinal, inspeccionId]);

    // 3. Creamos el registro del Certificado
    const fechaVencimiento = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    const insertCertificado = `
      INSERT INTO certificados (inspeccion_id, fecha_vencimiento, url_pdf, qr_codigo) 
      VALUES ($1, $2, $3, $4) 
      RETURNING uuid_certificado AS "uuidCertificado", inspeccion_id AS "inspeccionId", 
                fecha_emision AS "fechaEmision", fecha_vencimiento AS "fechaVencimiento", 
                url_pdf AS "urlPdf", qr_codigo AS "qrCodigo";
    `;
    const resCertificado = await pool.query(insertCertificado, [
      inspeccion.id, fechaVencimiento, 'generando...', 'generando...'
    ]);
    let nuevoCertificado = resCertificado.rows[0];

    // 4. Ensamblamos los datos para el PDF
    // Asegúrate de cambiar "TU_ENLACE_VERCEL" por el enlace real que te arrojó Vercel
    const urlValidacion = `https://cda-los-dujos-frontend.vercel.app/validar/${nuevoCertificado.uuidCertificado}`;
    
    const datosPDF = {
      uuid: nuevoCertificado.uuidCertificado,
      placa: inspeccion.vehiculo.placa,
      fecha: new Date().toLocaleDateString('es-CO'),
      resultado: resultadoFinal.toUpperCase(),
      qrUrl: urlValidacion
    };

    // 5. Generar el archivo físico PDF
    const rutaDelPdf = await generarCertificadoPDF(datosPDF);

    // 6. Actualizamos el registro en la base de datos con las URLs definitivas
    const updateCertificado = `
      UPDATE certificados 
      SET url_pdf = $1, qr_codigo = $2 
      WHERE uuid_certificado = $3 
      RETURNING uuid_certificado AS "uuidCertificado", inspeccion_id AS "inspeccionId", 
                fecha_emision AS "fechaEmision", fecha_vencimiento AS "fechaVencimiento", 
                url_pdf AS "urlPdf", qr_codigo AS "qrCodigo";
    `;
    const resUpdate = await pool.query(updateCertificado, [rutaDelPdf, urlValidacion, nuevoCertificado.uuidCertificado]);
    
    res.status(201).json({ status: 'success', data: resUpdate.rows[0] });

  } catch (error) {
    console.error('Error al emitir certificado:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error interno al generar el documento seguro' });
  }
};

const validarCertificado = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    const consulta = `
      SELECT 
        c.uuid_certificado AS "uuidCertificado", 
        c.fecha_emision AS "fechaEmision", 
        c.fecha_vencimiento AS "fechaVencimiento",
        i.estado as estado_inspeccion,
        json_build_object(
          'vehiculo', json_build_object('placa', v.placa)
        ) as inspeccion
      FROM certificados c
      JOIN inspecciones_quinta_rueda i ON c.inspeccion_id = i.id
      JOIN vehiculos v ON i.vehiculo_id = v.id
      WHERE c.uuid_certificado = $1;
    `;
    
    const resultado = await pool.query(consulta, [uuid]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ status: 'error', mensaje: 'Certificado no encontrado' });
    }

    res.status(200).json({ status: 'success', data: resultado.rows[0] });

  } catch (error) {
    console.error('Error al validar certificado:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error interno de validación' });
  }
};

module.exports = { emitirCertificado, validarCertificado };