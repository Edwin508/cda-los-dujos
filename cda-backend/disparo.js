async function crearAdmin() {
  console.log("🚀 Viajando hacia Render...");
  try {
    const respuesta = await fetch("https://cda-los-dujos.onrender.com/api/usuarios/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Administrador Maestro",
        correo: "admin@cdalosdujos.com",
        password: "admin123",
        rol: "ADMIN"
      })
    });
    
    const datos = await respuesta.json();
    console.log("✅ RESPUESTA DEL SERVIDOR:", datos);
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

crearAdmin();