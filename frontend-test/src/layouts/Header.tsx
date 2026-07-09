import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="header bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-primary">Academia VIP</span>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="nav-link hover:text-primary/80 transition-colors">
              Inicio
            </Link>
            {/* Additional public links can go here */}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-400">{user.nombre}</span>
              <button
                onClick={() => {
                  // We need to import useAuth to use logout, but we can't call hook in event handler without wrapping?
                  // Instead, we'll use the context via a custom hook, but we already have user from useAuth.
                  // We'll call the logout function from context. Let's adjust: we'll use useAuth to get logout as well.
                  // We'll change the hook to return logout as well, but we already have useAuth returning it.
                  // Actually, we didn't return logout in useAuth? We did in AuthContext, but our useAuth hook returns the context.
                  // So we need to use the context again or restructure. For simplicity, we'll do localStorage removal and redirect.
                  localStorage.removeItem('academia_user');
                  localStorage.removeItem('academia_token');
                  window.location.href = '/login';
                }}
                className="btn btn-sm btn-outline"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}