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
    const passwordHashGenerado = await bcrypt.hash(password, salt);

    // Crear el usuario apuntando a la tabla 'usuarios' y columna 'password_hash' exacta de Neon
    const consulta = `
      INSERT INTO usuarios (nombre, correo, password_hash, rol) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const valores = [nombre, correo, passwordHashGenerado, rol];

    const resultado = await pool.query(consulta, valores);
    const nuevoUsuario = resultado.rows[0];

    // Eliminamos el password del objeto de respuesta por seguridad
    const { password_hash: _, ...usuarioSinPassword } = nuevoUsuario;

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

    // 1. Buscar al usuario apuntando a la tabla 'usuarios' exacta de Neon
    const consulta = `SELECT * FROM usuarios WHERE correo = $1`;
    const resultado = await pool.query(consulta, [correo]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ status: 'error', mensaje: 'Credenciales inválidas' }); 
    }

    // 2. Comparar la contraseña ingresada con el hash guardado en 'password_hash'
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ status: 'error', mensaje: 'Credenciales inválidas' });
    }

    // 3. Generar el Token (JWT)
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Quitamos la contraseña de la respuesta
    const { password_hash, ...usuarioData } = usuario;

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

// --- NUEVA FUNCIÓN PARA LISTAR USUARIOS ---
const obtenerUsuarios = async (req, res) => {
  try {
    // Traemos todos los usuarios, pero sin el password_hash por seguridad
    const consulta = `
      SELECT id, nombre, correo, rol, creado_en 
      FROM usuarios 
      ORDER BY creado_en DESC;
    `;
    const resultado = await pool.query(consulta);

    res.status(200).json({ status: 'success', data: resultado.rows });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error interno al cargar el personal' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios
};