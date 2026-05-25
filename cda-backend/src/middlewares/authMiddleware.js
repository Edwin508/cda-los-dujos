const jwt = require('jsonwebtoken');

// 1. Verifica si la persona trae una credencial (Token) válida
const verificarToken = (req, res, next) => {
  // El token normalmente se envía en los Headers de la petición bajo 'Authorization'
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      status: 'error', 
      mensaje: 'Acceso denegado. Se requiere un token de autenticación.' 
    });
  }

  // Extraemos el token quitando la palabra "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Verificamos si el token es real y no ha expirado usando nuestra clave secreta
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Si es válido, guardamos los datos del usuario (id, rol) en la petición 
    // para que los controladores puedan saber quién está haciendo la acción
    req.usuario = payload;
    
    // Le damos paso al controlador
    next();
  } catch (error) {
    return res.status(403).json({ status: 'error', mensaje: 'Token inválido o expirado.' });
  }
};

// 2. Verifica si el rol del usuario está en la lista de invitados VIP
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        status: 'error', 
        mensaje: 'No tienes el nivel de acceso necesario para realizar esta acción.' 
      });
    }
    next();
  };
};

module.exports = { verificarToken, verificarRol };