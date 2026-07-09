import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/logo.svg" alt="Academia VIP" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Academia de Manejo San Cristóbal VIP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Inicia sesión para continuar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              error={error && 'Email inválido'}
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={error && 'Contraseña incorrecta'}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" isLoading={isLoading} fullWidth>
              Iniciar Sesión
            </Button>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-500">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?
            <a href="/register" className="font-medium text-primary hover:text-primary/80">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}