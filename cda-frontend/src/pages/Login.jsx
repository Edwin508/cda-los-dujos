import React, { useState } from 'react';
import api from '../services/api'; // Importamos la instancia de Axios que ya creaste

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // Como api.js ya tiene la URL base, solo llamamos al endpoint final
      const respuesta = await api.post('/usuarios/login', { correo, password });
      
      // Axios guarda la respuesta del servidor dentro de .data
      const datos = respuesta.data;

      // Guardamos el token y los datos del usuario en el navegador
      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));

      // Redirigimos al panel principal. 
      // Nota: Cambia '/dashboard' por la ruta principal que uses en App.jsx
      window.location.href = '/dashboard'; 

    } catch (err) {
      // Si el backend envía un error (ej. credenciales inválidas), lo capturamos aquí
      setError(
        err.response?.data?.mensaje || 'Error de conexión con el servidor'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    // Tailwind: Pantalla completa, centrado, fondo gris claro
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      
      {/* Tailwind: Tarjeta blanca, bordes redondeados, sombra */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CDA Los Dujos</h1>
          <p className="text-gray-500 text-sm">Sistema Integrado de Certificación</p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="correo">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="admin@cdalosdujos.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {cargando ? 'Verificando...' : 'Ingresar al Sistema'}
          </button>
          
        </form>

      </div>
    </div>
  );
};

export default Login;