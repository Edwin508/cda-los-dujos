require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./config/db'); 

// --- IMPORTACIÓN DE RUTAS ---
const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const inspeccionRoutes = require('./routes/inspeccionRoutes');
const certificadoRoutes = require('./routes/certificadoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());

// Hace que la carpeta 'uploads' (donde van las fotos y los PDFs) sea accesible públicamente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- RUTA DE PRUEBA (HEALTH CHECK) ---
app.get('/api/health', async (req, res) => {
  try {
    // Consulta de verificación rápida a la base de datos en Neon
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'success',
      mensaje: 'API del CDA operando correctamente y conectada a Neon 🚀',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Falló la conexión interna con la base de datos' 
    });
  }
});

// --- ENRUTAMIENTO DE LA API ---
app.use('/api/clientes', clienteRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/inspecciones', inspeccionRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// --- INICIALIZACIÓN DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de certificaciones corriendo en el puerto ${PORT}`);
});