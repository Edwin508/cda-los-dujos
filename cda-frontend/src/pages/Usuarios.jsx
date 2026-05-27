import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'INSPECTOR' // Valor por defecto según tu esquema (aunque lo mandaremos en mayúsculas para estandarizar)
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      // Asumimos que tienes un endpoint GET /usuarios configurado en tu backend
      const res = await api.get('/usuarios');
      setUsuarios(res.data.data || res.data); 
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Apuntamos a la ruta de registro (la misma que testeamos en el login)
      await api.post('/usuarios/registro', formData);
      
      setMensaje({ texto: 'Usuario registrado con éxito', tipo: 'success' });
      
      // Limpiar formulario (dejamos el rol por defecto en INSPECTOR)
      setFormData({ nombre: '', correo: '', password: '', rol: 'INSPECTOR' });
      
      // Recargar la tabla
      cargarUsuarios();
    } catch (error) {
      setMensaje({ 
        texto: error.response?.data?.mensaje || 'Error al registrar el usuario', 
        tipo: 'error' 
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Personal</h1>

        {/* --- Formulario de Registro --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border-t-4 border-gray-800">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Nuevo Usuario</h2>
          
          {mensaje.texto && (
            <div className={`p-4 mb-4 rounded-lg text-sm font-semibold text-center ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={registrarUsuario} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleInputChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="Ej. Carlos Mendoza"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo (Usuario)</label>
              <input 
                type="email" 
                name="correo" 
                value={formData.correo} 
                onChange={handleInputChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="carlos@cdalosdujos.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Temporal</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol en el Sistema</label>
              <select 
                name="rol" 
                value={formData.rol} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="INSPECTOR">Inspector (Pista)</option>
                <option value="INGENIERO">Ingeniero</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="lg:col-span-4 flex justify-end mt-2">
              <button 
                type="submit" 
                disabled={cargando} 
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md disabled:bg-gray-400"
              >
                {cargando ? 'Guardando...' : 'Crear Cuenta de Acceso'}
              </button>
            </div>
          </form>
        </div>

        {/* --- Tabla de Usuarios --- */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {usuario.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usuario.correo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${usuario.rol === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                          usuario.rol === 'INGENIERO' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(usuario.creadoEn || usuario.creado_en).toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron usuarios o cargando datos...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Usuarios;