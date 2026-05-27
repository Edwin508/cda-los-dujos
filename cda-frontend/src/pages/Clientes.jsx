import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombreRazonSocial: '',
    telefono: '',
    correo: ''
  });

  // Cargar clientes apenas abra la pantalla
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registrarCliente = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      await api.post('/clientes', formData);
      setMensaje({ texto: 'Cliente registrado con éxito', tipo: 'success' });
      
      // Limpiar formulario
      setFormData({ ...formData, numeroDocumento: '', nombreRazonSocial: '', telefono: '', correo: '' });
      
      // Recargar la tabla
      cargarClientes();
    } catch (error) {
      setMensaje({ 
        texto: error.response?.data?.mensaje || 'Error al registrar', 
        tipo: 'error' 
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Clientes</h1>

        {/* --- Formulario de Registro --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Nuevo Cliente</h2>
          
          {mensaje.texto && (
            <div className={`p-4 mb-4 rounded-lg text-sm font-semibold text-center ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={registrarCliente} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Doc.</label>
              <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="CC">Cédula (CC)</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula Ext. (CE)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número Documento</label>
              <input type="text" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre o Razón Social</label>
              <input type="text" name="nombreRazonSocial" value={formData.nombreRazonSocial} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo (Opcional)</label>
              <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="flex items-end">
              <button type="submit" disabled={cargando} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg transition-colors">
                {cargando ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </form>
        </div>

        {/* --- Tabla de Clientes --- */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registro</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cliente.tipoDocumento} {cliente.numeroDocumento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cliente.nombreRazonSocial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cliente.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cliente.creadoEn).toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No hay clientes registrados aún.
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

export default Clientes;