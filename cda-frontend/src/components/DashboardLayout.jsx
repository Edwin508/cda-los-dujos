import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  // useLocation nos permite saber en qué URL estamos parados actualmente
  const location = useLocation();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/'; // Redirige al login
  };

  // Definimos nuestro menú dinámico
  const menuItems = [
    { ruta: '/dashboard', icono: '👥', texto: 'Clientes' },
    { ruta: '/vehiculos', icono: '🚘', texto: 'Vehículos' },
    { ruta: '/inspecciones', icono: '📋', texto: 'Inspecciones' }, // <-- Coma agregada
    { ruta: '/certificados', icono: '📜', texto: 'Certificados' }
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-blue-400 tracking-wide">CDA Los Dujos</h2>
          <p className="text-sm text-gray-400 mt-1">Panel Operativo</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-3">
          {menuItems.map((item) => {
            // Evaluamos si la ruta actual coincide con la ruta del botón
            const activo = location.pathname === item.ruta;
            
            return (
              <Link 
                key={item.ruta}
                to={item.ruta} 
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  activo 
                    ? 'bg-blue-600 font-semibold shadow-md text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span className="mr-2">{item.icono}</span> {item.texto}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={cerrarSesion} 
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;