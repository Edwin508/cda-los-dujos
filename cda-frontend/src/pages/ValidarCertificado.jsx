import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ValidarCertificado = () => {
  // Extraemos el UUID de la URL (ej: /validar/1234-abcd)
  const { uuid } = useParams();
  
  const [certificado, setCertificado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    validarDocumento();
  }, [uuid]);

  const validarDocumento = async () => {
    try {
      // Hacemos la petición al backend para buscar este certificado específico
      // Nota: Asumimos que tu backend tiene una ruta GET /certificados/validar/:uuid
      const respuesta = await api.get(`/certificados/validar/${uuid}`);
      setCertificado(respuesta.data.data);
    } catch (err) {
      console.error('Error validando:', err);
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Consultando base de datos...</p>
        </div>
      </div>
    );
  }

  if (error || !certificado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-red-500">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificado Inválido</h2>
          <p className="text-gray-600">
            El documento que intenta validar no existe en los registros del CDA Los Dujos o la ruta es incorrecta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden border-t-4 border-green-500">
        
        <div className="bg-gray-900 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">CDA Los Dujos</h1>
          <p className="text-green-400 font-semibold text-sm tracking-widest uppercase">Documento Auténtico</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Inspección Aprobada</h2>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 text-sm font-medium">Placa:</span>
              <span className="text-gray-900 font-bold font-mono">{certificado.inspeccion?.vehiculo?.placa || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 text-sm font-medium">Fecha Emisión:</span>
              <span className="text-gray-900 font-semibold text-sm">
                {new Date(certificado.fechaEmision).toLocaleDateString('es-CO')}
              </span>
            </div>

            <div className="flex justify-between pb-1">
              <span className="text-gray-500 text-sm font-medium">Vencimiento:</span>
              <span className="text-red-600 font-bold text-sm">
                {new Date(certificado.fechaVencimiento).toLocaleDateString('es-CO')}
              </span>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              ID Único de Verificación:<br/>
              <span className="font-mono text-gray-500">{certificado.uuidCertificado}</span>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ValidarCertificado;