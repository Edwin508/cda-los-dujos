async function crearPrimerUsuario() {
  console.log("Enviando petición a tu propio servidor local...");

  try {
    // Llamamos a la ruta que tú mismo construiste en usuarioRoutes.js
    const respuesta = await fetch('http://localhost:3000/api/usuarios/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: 'Administrador Maestro',
        correo: 'admin@cdalosdujos.com',
        password: 'admin123', // Tu controlador la encriptará automáticamente
        rol: 'ADMIN'
      })
    });

    const data = await respuesta.json();

    if (data.status === 'success') {
      console.log('✅ ¡Éxito! El servidor registró al administrador.');
      console.log('👉 Correo: admin@cdalosdujos.com');
      console.log('👉 Contraseña: admin123');
    } else {
      console.log('⚠️ Respuesta del servidor:', data.mensaje);
    }

  } catch (error) {
    console.error('❌ Error de conexión. ¿Seguro que npm run dev está corriendo?', error.message);
  }
}

crearPrimerUsuario();