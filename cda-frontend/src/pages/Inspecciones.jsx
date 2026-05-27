import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Inspecciones = () => {
  const [inspecciones, setInspecciones] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Estados del formulario
  const [vehiculoId, setVehiculoId] = useState('');
  const [estado, setEstado] = useState('en_proceso');
  const [medidaDesgastePlato, setMedidaDesgastePlato] = useState('');
  const [medidaMordazas, setMedidaMordazas] = useState('');
  const [resultadoEnd, setResultadoEnd] = useState('');
  const [archivos, setArchivos] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resInspecciones, resVehiculos] = await Promise.all([
        api.get('/inspecciones'),
        api.get('/vehiculos')
      ]);
      setInspecciones(resInspecciones.data.data);
      setVehiculos(resVehiculos.data.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const registrarInspeccion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Obtenemos el ID del inspector logueado desde el localStorage
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
      
      // Armamos el paquete FormData
      const formData = new FormData();
      formData.append('vehiculoId', vehiculoId);
      formData.append('inspectorId', usuarioLocal.id);
      formData.append('estado', estado);
      
      if (medidaDesgastePlato) formData.append('medidaDesgastePlato', medidaDesgastePlato);
      if (medidaMordazas) formData.append('medidaMordazas', medidaMordazas);
      if (resultadoEnd) formData.append('resultadoEnd', resultadoEnd);
      
      // Adjuntamos las fotos usando la palabra exacta que espera Multer
      if (archivos) {
        for (let i = 0; i < archivos.length; i++) {
          formData.append('fotos', archivos[i]); 
        }
      }

      // Enviamos la petición a la ruta correcta
      await api.post('/inspecciones', formData);
      
      setMensaje({ texto: 'Inspección registrada con éxito', tipo: 'success' });
      
      // Limpiamos el formulario
      setVehiculoId('');
      setEstado('en_proceso');
      setMedidaDesgastePlato('');
      setMedidaMordazas('');
      setResultadoEnd('');
      setArchivos(null);
      
      // Recargamos la tabla
      cargarDatos();
      
    } catch (error) {
      setMensaje({ 
        texto: error.response?.data?.mensaje || 'Error al registrar la inspección', 
        tipo: 'error' 
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pista: Inspección Quinta Rueda</h1>

        {/* --- Formulario de Registro --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nueva Inspección</h2>
          
          {mensaje.texto && (
            <div className={`p-4 mb-4 rounded-lg text-sm font-semibold text-center ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={registrarInspeccion} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Columna Izquierda: Datos del Vehículo y Estado */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo a Inspeccionar</label>
                <select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors">
                  <option value="">Seleccione placa...</option>
                  {vehiculos.map(v => (
                    <option key={v.id} value={v.id}>{v.placa} - {v.tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Preliminar</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors">
                  <option value="en_proceso">En Proceso</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidencias Fotográficas</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => setArchivos(e.target.files)} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </div>
            </div>

            {/* Columna Derecha: Mediciones Técnicas */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desgaste del Plato (mm)</label>
                <input type="number" step="0.01" value={medidaDesgastePlato} onChange={(e) => setMedidaDesgastePlato(e.target.value)} placeholder="Ej. 2.50" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medida Mordazas (mm)</label>
                <input type="number" step="0.01" value={medidaMordazas} onChange={(e) => setMedidaMordazas(e.target.value)} placeholder="Ej. 1.20" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resultado END (Opcional)</label>
                <textarea value={resultadoEnd} onChange={(e) => setResultadoEnd(e.target.value)} rows="2" placeholder="Observaciones de Ensayos No Destructivos..." className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors"></textarea>
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <button type="submit" disabled={cargando} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-md">
                {cargando ? 'Subiendo datos y fotos...' : 'Registrar Inspección en Pista'}
              </button>
            </div>
          </form>
        </div>

        {/* --- Tabla de Inspecciones --- */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Fecha / Placa</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Inspector</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Desgaste Plato</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Fotos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inspecciones.length > 0 ? (
                inspecciones.map((insp) => (
                  <tr key={insp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 font-mono">{insp.vehiculo?.placa || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{new Date(insp.fechaInspeccion).toLocaleDateString('es-CO')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {insp.inspector?.nombre || 'Desconocido'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {insp.medidaDesgastePlato ? `${insp.medidaDesgastePlato} mm` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${insp.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 
                          insp.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {insp.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                        {insp.evidencias?.length || 0} fotos
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No hay inspecciones en el historial.
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

export default Inspecciones;