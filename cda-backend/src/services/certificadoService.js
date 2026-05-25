const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Nos aseguramos de que la carpeta de certificados exista
const certDir = path.join(__dirname, '../../uploads/certificados');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

const generarCertificadoPDF = (datosPDF) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { uuid, placa, fecha, resultado, qrUrl } = datosPDF;
      const fileName = `certificado_${placa}_${Date.now()}.pdf`;
      const filePath = path.join(certDir, fileName);

      // 1. Generar la imagen del Código QR en base64
      const qrImage = await QRCode.toDataURL(qrUrl);

      // 2. Iniciar el trazado del documento PDF
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // --- DISEÑO DEL PDF ---
      
      // Título
      doc.fontSize(20).font('Helvetica-Bold')
         .text('CERTIFICADO DE INSPECCIÓN TÉCNICA', { align: 'center' });
      doc.fontSize(14).text('QUINTA RUEDA', { align: 'center' });
      doc.moveDown(2);
      
      // Cuerpo y Datos
      doc.fontSize(12).font('Helvetica')
         .text(`Vehículo Inspeccionado (Placa): ${placa}`);
      doc.text(`Fecha de Emisión: ${fecha}`);
      doc.text(`Estado Final de la Inspección: ${resultado.toUpperCase()}`);
      doc.moveDown(3);

      // Nota de seguridad
      doc.fontSize(10).font('Helvetica-Oblique')
         .text('Este documento es generado electrónicamente. Para verificar su autenticidad, escanee el código QR.', { align: 'center' });
      doc.moveDown(1);

      // Insertar el Código QR
      doc.image(qrImage, { fit: [120, 120], align: 'center' });
      doc.moveDown(1);
      
      // UUID debajo del QR
      doc.fontSize(8).font('Helvetica')
         .text(`ID Único de Validación: ${uuid}`, { align: 'center' });

      // Finalizar el documento
      doc.end();

      // 3. Esperar a que el archivo se guarde en el disco
      stream.on('finish', () => {
        resolve(`/uploads/certificados/${fileName}`);
      });
      
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generarCertificadoPDF };