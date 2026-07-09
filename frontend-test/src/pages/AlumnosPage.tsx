import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumnoService } from '../services/alumnoService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Card from '../components/Common/Card';
import Loading from '../components/Common/Loading';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const cargarAlumnos = async () => {
    try {
      setIsLoading(true);
      const data = await alumnoService.listar();
      setAlumnos(data);
    } catch (error) {
      console.error('Error cargando alumnos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (selectedAlumno) {
        // Update existing alumno
        const updated = await alumnoService.actualizar(selectedAlumno.id, {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        });
        setAlumnos(prev => prev.map(a => a.id === updated.id ? updated : a));
      } else {
        // Create new alumno
        const nuevo = await alumnoService.crear({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        });
        setAlumnos(prev => [nuevo, ...prev]);
      }
      setShowForm(false);
      setFormData({ nombre: '', email: '', telefono: '' });
      setSelectedAlumno(null);
    } catch (err) {
      console.error('Error al guardar alumno:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este alumno?')) {
      setIsLoading(true);
      try {
        await alumnoService.eliminar(id);
        setAlumnos(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        console.error('Error al eliminar alumno:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditar = (alumno: any) => {
    setSelectedAlumno(alumno);
    setFormData({
      nombre: alumno.nombre,
      email: alumno.email,
      telefono: alumno.telefono || ''
    });
    setShowForm(true);
  };

  // Load data on mount
  // useEffect(() => {
  //   cargarAlumnos();
  // }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-wrap mb-6">
        <h1 className="text-2xl font-bold">Gestión de Alumnos</h1>
        <Button onClick={() => setShowForm(true)}>Nuevo Alumno</Button>
      </div>

      {/* Modal for form */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <h2 className="text-xl font-bold mb-4">{selectedAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
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
            <Button type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isLoading}>
              {selectedAlumno ? 'Actualizar' : 'Crear Alumno'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Alumnos list */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Alumnos</h2>
        {isLoading ? (
          <Loading className="mx-auto" />
        ) : (
          <div>
            {alumnos.length > 0 ? (
              <DataTable
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'email', label: 'Email' },
                  { key: 'telefono', label: 'Teléfono' },
                  { key: 'acciones', label: 'Acciones' }
                ]}
                data={alumnos}
                onRowClick={handleEditar}
              />
            ) : (
              <p className="text-gray-400 text-center py-4">No hay alumnos registrados</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}