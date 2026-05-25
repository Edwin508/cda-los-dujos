const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Nos aseguramos de que la carpeta uploads exista, si no, Node la crea.
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento (Storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Le decimos a Multer que guarde todo en la carpeta 'uploads'
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Extraemos la extensión original (ej. .jpg, .png)
    const ext = path.extname(file.originalname);
    // Armamos un nombre único: foto_fechadeHoy_numeroRandom.jpg
    const uniqueName = `foto_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtro para aceptar SOLAMENTE imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato no soportado, solo se permiten imágenes'), false);
  }
};

// Instanciamos Multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5 MB por foto
});

module.exports = upload;