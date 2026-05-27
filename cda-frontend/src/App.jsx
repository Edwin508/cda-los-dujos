import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de las vistas
import Login from './pages/Login';
import Clientes from './pages/Clientes';
import Vehiculos from './pages/Vehiculos';
import Inspecciones from './pages/Inspecciones';
import Certificados from './pages/Certificados';
import ValidarCertificado from './pages/ValidarCertificado';

/**
 * Componente Guardián (Protected Route):
 * Revisa si hay un token en el navegador. 
 * Si lo hay, deja pasar al usuario. Si no, lo patea de vuelta al Login.
 */
const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        
        {/* Ruta Pública: Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta Pública: Validación de Certificado mediante Código QR */}
        <Route path="/validar/:uuid" element={<ValidarCertificado />} />

        {/* Rutas Privadas del Sistema */}
        <Route 
          path="/dashboard" 
          element={
            <RutaProtegida>
              <Clientes />
            </RutaProtegida>
          } 
        />
       
        <Route 
          path="/vehiculos" 
          element={
            <RutaProtegida>
              <Vehiculos />
            </RutaProtegida>
          } 
        />
         
        <Route 
          path="/inspecciones" 
          element={
            <RutaProtegida>
              <Inspecciones />
            </RutaProtegida>
          } 
        />

        <Route 
          path="/certificados" 
          element={
            <RutaProtegida>
              <Certificados />
            </RutaProtegida>
          } 
        />

        {/* Si el usuario escribe una ruta que no existe, lo mandamos al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;