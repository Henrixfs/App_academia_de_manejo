import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumnoService } from '../services/alumnoService';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await alumnoService.crear({ nombre, email, telefono });
      // After successful registration, redirect to login
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
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
            Registro de Nuevo Alumno
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Completa tus datos para crear una cuenta
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre" className="sr-only">
              Nombre completo
            </label>
            <Input
              id="nombre"
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              required
              error={error && 'Nombre requerido'}
            />
          </div>

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
            <label htmlFor="telefono" className="sr-only">
              Teléfono
            </label>
            <Input
              id="telefono"
              type="tel"
              name="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+51 999 999 999"
            />
          </div>

          <div>
            <Button type="submit" isLoading={isLoading} fullWidth>
              Crear Cuenta
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
            Ya tienes cuenta?
            <a href="/login" className="font-medium text-primary hover:text-primary/80">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}