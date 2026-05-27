import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Certificados = () => {
  const [inspecciones, setInspecciones] = useState([]);
  const [cargandoId, setCargandoId] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // URL base de tu backend en Render para concatenar la ruta del PDF
  const BACKEND_URL = 'https://cda-los-dujos.onrender.com';

  useEffect(() => {
    cargarInspecciones();
  }, []);

  const cargarInspecciones = async () => {
    try {
      const res = await api.get('/inspecciones');
      setInspecciones(res.data.data);
    } catch (error) {
      console.error("Error cargando inspecciones:", error);
    }
  };

  const emitirCertificado = async (inspeccionId) => {
    setCargandoId(inspeccionId);
    setMensaje({ texto: '', tipo: '' });

    try {
      await api.post('/certificados', { inspeccionId });
      
      setMensaje({ texto: '¡Certificado emitido y PDF generado con éxito!', tipo: 'success' });
      cargarInspecciones(); 
    } catch (error) {
      setMensaje({ 
        texto: error.response?.data?.mensaje || 'Error al emitir el certificado', 
        tipo: 'error' 
      });
    } finally {
      setCargandoId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Emisión de Certificados</h1>

        {mensaje.texto && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-semibold border ${mensaje.tipo === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-4 border-yellow-500">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha Inspección</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado en Pista</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Documento</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inspecciones.length > 0 ? (
                inspecciones.map((insp) => (
                  <tr key={insp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 font-mono">{insp.vehiculo?.placa || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{insp.vehiculo?.tipo || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(insp.fechaInspeccion).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${insp.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 
                          insp.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {insp.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {/* Enlace corregido apuntando directamente a Render */}
                      {insp.certificado ? (
                        <a 
                          href={`${BACKEND_URL}${insp.certificado.urlPdf}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                        >
                          📄 Ver PDF
                        </a>
                      ) : (
                        <button
                          onClick={() => emitirCertificado(insp.id)}
                          disabled={cargandoId === insp.id || insp.estado === 'rechazado'}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors
                            ${insp.estado === 'rechazado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                          `}
                        >
                          {cargandoId === insp.id ? 'Generando...' : 'Emitir Certificado'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No hay inspecciones para certificar.
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

export default Certificados;