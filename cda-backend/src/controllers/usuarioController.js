const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario (Idealmente solo el ADMIN puede hacer esto)
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validación básica
    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ status: 'error', mensaje: 'Todos los campos son obligatorios' });
    }

    // Verificar que los roles sean válidos
    const rolesValidos = ['INSPECTOR', 'INGENIERO', 'COORDINADOR', 'ADMIN'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ status: 'error', mensaje: 'El rol ingresado no es válido' });
    }

    // Encriptar (hashear) la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear el usuario en la BD usando SQL puro
    const consulta = `
      INSERT INTO "Usuario" (nombre, correo, "passwordHash", rol) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const valores = [nombre, correo, passwordHash, rol];

    const resultado = await pool.query(consulta, valores);
    const nuevoUsuario = resultado.rows[0];

    // Eliminamos el password del objeto de respuesta por seguridad
    const { passwordHash: _, ...usuarioSinPassword } = nuevoUsuario;

    res.status(201).json({ status: 'success', data: usuarioSinPassword });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    // Código 23505 en PostgreSQL significa "Unique violation" (correo duplicado)
    if (error.code === '23505') {
      return res.status(409).json({ status: 'error', mensaje: 'El correo ya se encuentra registrado' });
    }
    res.status(500).json({ status: 'error', mensaje: 'Error interno del servidor' });
  }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ status: 'error', mensaje: 'Correo y contraseña son obligatorios' });
    }

    // 1. Buscar al usuario por correo usando SQL puro
    const consulta = `SELECT * FROM "Usuario" WHERE correo = $1`;
    const resultado = await pool.query(consulta, [correo]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ status: 'error', mensaje: 'Credenciales inválidas' }); 
    }

    // 2. Comparar la contraseña ingresada con el hash guardado
    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValido) {
      return res.status(401).json({ status: 'error', mensaje: 'Credenciales inválidas' });
    }

    // 3. Generar el Token (JWT)
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // El token expira en el turno de trabajo de 8 horas
    );

    // Quitamos la contraseña de la respuesta
    const { passwordHash, ...usuarioData } = usuario;

    // Entregamos el token y los datos del usuario
    res.status(200).json({ 
      status: 'success', 
      token, 
      usuario: usuarioData 
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario
};