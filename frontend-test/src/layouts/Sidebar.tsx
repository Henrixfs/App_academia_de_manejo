import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, isAlumno, isAdmin } = useAuth();

  return (
    <aside className="sidebar bg-gray-800/50 backdrop-blur-md border-r border-gray-700">
      <div className="px-4 pt-5 pb-3">
        <nav className="space-y-2">
          {/* Common links */}
          <Link to="/dashboard" className={`nav-link flex items-center px-3 py-2 rounded-md text-base font-medium ${window.location.pathname === '/dashboard' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-gray-700'}`}>
            Dashboard
          </Link>

          {/* Alumno specific */}
          {isAlumno && (
            <>
              <Link to="/reservas" className={`nav-link flex items-center px-3 py-2 rounded-md text-base font-medium ${window.location.pathname === '/reservas' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-gray-700'}`}>
                Mis Reservas
              </Link>
              <Link to="/perfil" className={`nav-link flex items-center px-3 py-2 rounded-md text-base font-medium ${window.location.pathname === '/perfil' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-gray-700'}`}>
                Mi Perfil
              </Link>
            </>
          )}

          {/* Admin specific */}
          {isAdmin && (
            <>
              <Link to="/alumnos" className={`nav-link flex items-center px-3 py-2 rounded-md text-base font-medium ${window.location.pathname === '/alumnos' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-gray-700'}`}>
                Alumnos
              </Link>
              <Link to="/reservas" className={`nav-link flex items-center px-3 py-2 rounded-md text-base font-medium ${window.location.pathname === '/reservas' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-gray-700'}`}>
                Todas las Reservas
              </Link>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}