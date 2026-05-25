const prisma = require('../config/db');
const { generarCertificadoPDF } = require('../services/certificadoService');

const emitirCertificado = async (req, res) => {
  try {
    const { inspeccionId } = req.body;

    if (!inspeccionId) {
      return res.status(400).json({ status: 'error', mensaje: 'El ID de la inspección es obligatorio' });
    }

    // 1. Buscamos la inspección y los datos del vehículo
    const inspeccion = await prisma.inspeccionQuintaRueda.findUnique({
      where: { id: inspeccionId },
      include: { vehiculo: true, certificado: true }
    });

    if (!inspeccion) {
      return res.status(404).json({ status: 'error', mensaje: 'Inspección no encontrada' });
    }

    if (inspeccion.certificado) {
      return res.status(400).json({ status: 'error', mensaje: 'Esta inspección ya tiene un certificado emitido' });
    }

    // 2. Creamos el registro del Certificado en la base de datos PRIMERO
    // Esto es vital para que Postgres nos devuelva el UUID seguro recién generado
    let nuevoCertificado = await prisma.certificado.create({
      data: {
        inspeccionId: inspeccion.id,
        // Por defecto, vigencia de 1 año
        fechaVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 
        urlPdf: 'generando...',
        qrCodigo: 'generando...'
      }
    });

    // 3. Ensamblamos los datos para el PDF
    // La URL a la que apuntará el QR cuando alguien lo escanee con el celular
    const urlValidacion = `https://sistema.cdalosdujos.com/validar/${nuevoCertificado.uuidCertificado}`;
    
    const datosPDF = {
      uuid: nuevoCertificado.uuidCertificado,
      placa: inspeccion.vehiculo.placa,
      fecha: new Date().toLocaleDateString('es-CO'),
      resultado: inspeccion.estado,
      qrUrl: urlValidacion
    };

    // 4. Mandamos a generar el archivo físico PDF
    const rutaDelPdf = await generarCertificadoPDF(datosPDF);

    // 5. Actualizamos el registro en la base de datos con las rutas reales
    nuevoCertificado = await prisma.certificado.update({
      where: { uuidCertificado: nuevoCertificado.uuidCertificado },
      data: { 
        urlPdf: rutaDelPdf, 
        qrCodigo: urlValidacion 
      }
    });

    res.status(201).json({ status: 'success', data: nuevoCertificado });

  } catch (error) {
    console.error('Error al emitir certificado:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error interno al generar el documento seguro' });
  }
};

module.exports = { emitirCertificado };