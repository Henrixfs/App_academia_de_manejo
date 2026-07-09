import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumnoService } from '../services/alumnoService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Card from '../components/Common/Card';
import Loading from '../components/Common/Loading';
import Alert from '../components/Common/Alert';

export default function PerfilPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  // Load user profile from API
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await alumnoService.obtener(user.id);
        setPerfil(data);
        setFormData({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono || ''
        });
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setMessage('Error al cargar el perfil');
        setMessageType('error');
      } finally {
        setIsLoading(false);
      }
    };

    cargarPerfil();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await alumnoService.actualizar(user.id, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono
      });
      setPerfil(updated);
      setIsEditing(false);
      setMessage('Perfil actualizado correctamente');
      setMessageType('success');
      // Update the user in auth context
      // We don't have a direct way to update the context from here, but we can rely on the next fetch
      // or we could update the context via a function. For simplicity, we'll just update the local state.
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setMessage('Error al actualizar el perfil');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <Loading />;

  return (
    <div className="p-6">
      {message && (
        <Alert type={messageType} onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}

      <div className="flex justify-between items-wrap mb-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <div className="flex space-x-3">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          )}
          {isEditing && (
            <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
          )}
        </div>
      </div>

      {!perfil && isLoading ? (
        <Loading className="mx-auto" />
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Avatar"
                className="w-24 h-24 mx-auto rounded-full border-4 border-primary"
              />
              <h2 className="mt-4 text-xl font-bold">{perfil?.nombre}</h2>
              <p className="text-gray-400">{perfil?.email}</p>
              {perfil?.telefono && (
                <p className="text-gray-400">{perfil?.telefono}</p>
              )}
              <p className="text-gray-500 mt-2">
                Rol: {perfil?.rol === 'admin' ? 'Administrador' : 'Alumno'}
              </p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-300">
                    Nombre completo
                  </label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alumno@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-300">
                    Teléfono (opcional)
                  </label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+51 999 999 999"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button type="submit" isLoading={isLoading}>
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300">Nombre completo</p>
                  <p className="text-white font-medium">{perfil?.nombre}</p>
                </div>

                <div>
                  <p className="text-gray-300">Email</p>
                  <p className="text-white font-medium">{perfil?.email}</p>
                </div>

                <div>
                  <p className="text-gray-300">Teléfono</p>
                  <p className="text-white font-medium">{perfil?.telefono || 'No proporcionado'}</p>
                </div>

                <div>
                  <p className="text-gray-300">Rol</p>
                  <p className="text-white font-medium">
                    {perfil?.rol === 'admin' ? 'Administrador' : 'Alumno'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-300">Fecha de registro</p>
                  <p className="text-white font-medium">
                    {perfil?.created_at ? new Date(perfil.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}