import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]); // Para el menú desplegable
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const [formData, setFormData] = useState({
    placa: '',
    clienteId: '',
    marca: '',
    modelo: '',
    tipo: 'Automóvil'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Pedimos vehículos y clientes en paralelo para mayor velocidad
      const [resVehiculos, resClientes] = await Promise.all([
        api.get('/vehiculos'),
        api.get('/clientes')
      ]);
      setVehiculos(resVehiculos.data.data);
      setClientes(resClientes.data.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleInputChange = (e) => {
    // Forzamos que la placa siempre esté en mayúsculas mientras el usuario escribe
    const valor = e.target.name === 'placa' ? e.target.value.toUpperCase() : e.target.value;
    setFormData({ ...formData, [e.target.name]: valor });
  };

  const registrarVehiculo = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Asumo que tu ruta en vehiculoRoutes.js es POST /vehiculos/registro (similar a clientes)
      // Si tu ruta es solo POST /vehiculos, cámbialo aquí abajo:
      await api.post('/vehiculos', formData);
      setMensaje({ texto: 'Vehículo registrado con éxito', tipo: 'success' });
      
      setFormData({ ...formData, placa: '', marca: '', modelo: '' });
      cargarDatos(); // Recargar la tabla
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Vehículos</h1>

        {/* --- Formulario de Registro --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Nuevo Vehículo</h2>
          
          {mensaje.texto && (
            <div className={`p-4 mb-4 rounded-lg text-sm font-semibold text-center ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={registrarVehiculo} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
              <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} maxLength="6" required placeholder="XYZ123" className="w-full p-2 border border-gray-300 rounded-lg font-mono uppercase" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (Propietario)</label>
              <select name="clienteId" value={formData.clienteId} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="">Seleccione un propietario...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombreRazonSocial} - {cliente.tipoDocumento} {cliente.numeroDocumento}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
              <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="Automóvil">Automóvil</option>
                <option value="Motocicleta">Motocicleta</option>
                <option value="Camioneta">Camioneta</option>
                <option value="Vehículo Pesado">Vehículo Pesado</option>
                <option value="Remolque/Semiremolque">Remolque / Semiremolque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca (Opcional)</label>
              <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} placeholder="Ej. Chevrolet" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo/Año (Opcional)</label>
              <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} maxLength="4" placeholder="2024" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-3 flex justify-end mt-2">
              <button type="submit" disabled={cargando} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                {cargando ? 'Guardando...' : 'Guardar Vehículo'}
              </button>
            </div>
          </form>
        </div>

        {/* --- Tabla de Vehículos --- */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Propietario</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo / Marca</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registro</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehiculos.length > 0 ? (
                vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 font-mono">
                      {vehiculo.placa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {vehiculo.cliente ? vehiculo.cliente.nombreRazonSocial : <span className="text-red-500">Sin asignar</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {vehiculo.tipo} {vehiculo.marca && `- ${vehiculo.marca}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vehiculo.creadoEn).toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No hay vehículos registrados aún.
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

export default Vehiculos;