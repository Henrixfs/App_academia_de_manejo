import React, { createContext, useState, useEffect, useContext } from 'react';

// Tipos
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'alumno' | 'admin'; // Crítico: detectar rol aquí
  telefono?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAlumno: boolean;
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos guardados al montar
  useEffect(() => {
    const savedUser = localStorage.getItem('academia_user');
    const savedToken = localStorage.getItem('academia_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // MVP: buscar el usuario en la BD y validar
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/alumnos/`);
      if (!response.ok) throw new Error('Error al obtener usuarios');
      const users: User[] = await response.json();

      const usuario = users.find((u: User) => u.email === email);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Nota: En producción, esto sería un endpoint de login con JWT
      // Por ahora, simulamos la autenticación

      // Determinar rol basado en el email o BD
      // (En un sistema real, el backend lo devolvería)
      const rol = email.includes('admin') ? 'admin' : 'alumno';

      const userData = { ...usuario, rol };

      setUser(userData);
      setToken(`token_${usuario.id}_${Date.now()}`); // Token ficticio

      localStorage.setItem('academia_user', JSON.stringify(userData));
      localStorage.setItem('academia_token', `token_${usuario.id}_${Date.now()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('academia_user');
    localStorage.removeItem('academia_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.rol === 'admin',
        isAlumno: user?.rol === 'alumno',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}