import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';

// Un componente temporal para el Dashboard
const Dashboard = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-green-600">¡Bienvenido al Panel Principal!</h1>
    <p>Has iniciado sesión correctamente.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Si entran a la raíz, los mandamos al login por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;