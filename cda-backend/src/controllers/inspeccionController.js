const prisma = require('../config/db');

// Registrar una nueva inspección con sus fotos
const crearInspeccion = async (req, res) => {
  try {
    // 1. Extraemos los datos de texto (Body) y las imágenes (Files de Multer)
    const { vehiculoId, inspectorId, estado, medidaDesgastePlato, medidaMordazas, resultadoEnd } = req.body;
    const archivos = req.files; 

    // Validación básica
    if (!vehiculoId || !inspectorId) {
      return res.status(400).json({ 
        status: 'error', 
        mensaje: 'El ID del vehículo y del inspector son obligatorios' 
      });
    }

    // 2. Preparamos las evidencias fotográficas para Prisma
    let evidenciasData = [];
    if (archivos && archivos.length > 0) {
      evidenciasData = archivos.map((file) => ({
        tipoFoto: 'general', // A futuro, esto puede venir del frontend (ej. 'fisura', 'placa')
        urlImagen: `/uploads/${file.filename}` // Guardamos la ruta relativa
      }));
    }

    // 3. Magia de Prisma: Guardamos la inspección y sus fotos en un solo paso (Nested Create)
    const nuevaInspeccion = await prisma.inspeccionQuintaRueda.create({
      data: {
        vehiculoId,
        inspectorId,
        estado: estado || 'en_proceso',
        // Convertimos a número porque desde el 'form-data' del frontend todo llega como texto
        medidaDesgastePlato: medidaDesgastePlato ? parseFloat(medidaDesgastePlato) : null,
        medidaMordazas: medidaMordazas ? parseFloat(medidaMordazas) : null,
        resultadoEnd,
        // Insertamos el array de fotos directamente vinculado a esta inspección
        evidencias: {
          create: evidenciasData
        }
      },
      // Le pedimos a Prisma que nos responda con las fotos y el vehículo para confirmar
      include: {
        evidencias: true,
        vehiculo: { select: { placa: true } }
      }
    });

    res.status(201).json({ status: 'success', data: nuevaInspeccion });

  } catch (error) {
    console.error('Error al registrar inspección:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al registrar la inspección en pista' });
  }
};

// Obtener todas las inspecciones (Para el panel de control)
const obtenerInspecciones = async (req, res) => {
  try {
    const inspecciones = await prisma.inspeccionQuintaRueda.findMany({
      include: {
        vehiculo: true,
        inspector: { select: { nombre: true } }, // Solo traemos el nombre del ingeniero, no su contraseña
        evidencias: true,
        certificado: true
      },
      orderBy: { fechaInspeccion: 'desc' }
    });
    
    res.status(200).json({ status: 'success', data: inspecciones });
  } catch (error) {
    console.error('Error al obtener inspecciones:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al cargar el historial de inspecciones' });
  }
};

module.exports = {
  crearInspeccion,
  obtenerInspecciones
};