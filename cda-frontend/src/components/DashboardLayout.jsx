import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/'; 
  };

  const menuItems = [
    { ruta: '/dashboard', icono: '👥', texto: 'Clientes' },
    { ruta: '/vehiculos', icono: '🚘', texto: 'Vehículos' },
    { ruta: '/inspecciones', icono: '📋', texto: 'Inspecciones' },
    { ruta: '/certificados', icono: '📜', texto: 'Certificados' },
    { ruta: '/usuarios', icono: '⚙️', texto: 'Usuarios' }
  ];

  return (
    /* Bloqueamos el scroll de toda la pantalla (overflow-hidden) */
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      
      {/* Reducimos el ancho en móvil (w-48) y evitamos que se aplaste (flex-shrink-0) */}
      <aside className="w-48 md:w-64 bg-gray-900 text-white flex flex-col shadow-xl flex-shrink-0 z-10">
        <div className="p-4 md:p-6 border-b border-gray-800">
          <h2 className="text-xl md:text-2xl font-bold text-blue-400 tracking-wide">CDA Los Dujos</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Panel Operativo</p>
        </div>
        
        {/* Permitimos scroll interno en los botones (overflow-y-auto) */}
        <nav className="flex-1 px-2 md:px-4 py-4 md:py-6 space-y-2 md:space-y-3 overflow-y-auto">
          {menuItems.map((item) => {
            const activo = location.pathname === item.ruta;
            return (
              <Link 
                key={item.ruta}
                to={item.ruta} 
                className={`block px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
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
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm md:text-base"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* El contenedor principal ahora maneja su propio scroll internamente */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;