import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservaService } from '../services/reservaService';
import { alumnoService } from '../services/alumnoService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Card from '../components/Common/Card';
import Loading from '../components/Common/Loading';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';

export default function ReservasPage() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<any>(null);
  const [formData, setFormData] = useState({
    alumno_id: '',
    servicio_id: '',
    fecha: '',
    duracion_minutos: '',
    notas: ''
  });
  const navigate = useNavigate();

  // For editing or viewing details
  const { id } = useParams<{ id: string }>();
  const isDetailView = !!id;

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const [reservasData, alumnosData] = await Promise.all([
        reservaService.listar(),
        alumnoService.listar(),
      ]);
      setReservas(reservasData);
      setAlumnos(alumnosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (selectedReserva) {
        // Update existing reservation
        const updated = await reservaService.actualizar(selectedReserva.id, {
          alumno_id: Number(formData.alumno_id),
          servicio_id: Number(formData.servicio_id),
          fecha: formData.fecha,
          duracion_minutos: Number(formData.duracion_minutos),
          notas: formData.notas
        });
        setReservas(prev => prev.map(r => r.id === updated.id ? updated : r));
      } else {
        // Create new reservation
        const nueva = await reservaService.crear({
          alumno_id: Number(formData.alumno_id),
          servicio_id: Number(formData.servicio_id),
          fecha: formData.fecha,
          duracion_minutos: Number(formData.duracion_minutos),
          notas: formData.notas
        });
        setReservas(prev => [nueva, ...prev]);
      }
      setShowForm(false);
      setFormData({
        alumno_id: '',
        servicio_id: '',
        fecha: '',
        duracion_minutos: '',
        notas: ''
      });
      setSelectedReserva(null);
    } catch (err) {
      console.error('Error al guardar reserva:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = async (id: number) => {
    if (window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      setIsLoading(true);
      try {
        await reservaService.cancelar(id);
        setReservas(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        console.error('Error al cancelar reserva:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReprogramar = async (id: number) => {
    const nuevaFecha = window.prompt('Ingrese la nueva fecha (YYYY-MM-DD HH:MM):');
    if (nuevaFecha) {
      setIsLoading(true);
      try {
        await reservaService.reprogramar(id, nuevaFecha);
        setReservas(prev => prev.map(r => r.id === id ? { ...r, fecha: nuevaFecha } : r));
      } catch (err) {
        console.error('Error al reprogramar reserva:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerDetalles = (reserva: any) => {
    setSelectedReserva(reserva);
    setFormData({
      alumno_id: reserva.alumno_id.toString(),
      servicio_id: reserva.servicio_id.toString(),
      fecha: reserva.fecha,
      duracion_minutos: reserva.duracion_minutos.toString(),
      notas: reserva.notas || ''
    });
    setShowForm(true);
  };

  // Load data on mount
  // useEffect(() => {
  //   cargarDatos();
  // }, []);

  if (isDetailView) {
    // Show reservation details
    const reserva = reservas.find(r => r.id === Number(id));
    if (!reserva) {
      return <div>Reserva no encontrada</div>;
    }

    return (
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Detalle de Reserva</h1>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
        <Card className="p-6">
          <p><strong>ID:</strong> {reserva.id}</p>
          <p><strong>Alumno ID:</strong> {reserva.alumno_id}</p>
          <p><strong>Servicio ID:</strong> {reserva.servicio_id}</p>
          <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleString()}</p>
          <p><strong>Duración:</strong> {reserva.duracion_minutos} minutos</p>
          <p><strong>Estado:</strong>
            <span className={`badge inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              reserva.estado === 'CONFIRMADA' ? 'bg-green-500/20 text-green-400' :
              reserva.estado === 'CANCELADA' ? 'bg-red-500/20 text-red-400' :
              reserva.estado === 'COMPLETADA' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {reserva.estado}
            </span>
          </p>
          {reserva.notas && <p><strong>Notas:</strong> {reserva.notas}</p>}
          <div className="mt-6 flex justify-end space-x-3">
            <Button onClick={() => navigate(-1)}>Volver</Button>
            <Button onClick={() => handleCancelar(reserva.id)} variant="danger">
              Cancelar Reserva
            </Button>
            <Button onClick={() => handleReprogramar(reserva.id)}>
              Reprogramar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-wrap mb-6">
        <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
        <div className="flex space-x-3">
          <Button onClick={() => setShowForm(true)}>Nueva Reserva</Button>
          <Button onClick={() => navigate('/reservas/nueva')}>+ Nueva</Button>
        </div>
      </div>

      {/* Modal for form */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <h2 className="text-xl font-bold mb-4">{selectedReserva ? 'Editar Reserva' : 'Nueva Reserva'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="alumno_id" className="block mb-2 text-sm font-medium text-gray-300">
              Alumno
            </label>
            <select
              id="alumno_id"
              value={formData.alumno_id}
              onChange={(e) => setFormData({ ...formData, alumno_id: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-primary"
              required
            >
              <option value="">Seleccione un alumno</option>
              {alumnos.map((alumno: any) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="servicio_id" className="block mb-2 text-sm font-medium text-gray-300">
              Servicio
            </label>
            <select
              id="servicio_id"
              value={formData.servicio_id}
              onChange={(e) => setFormData({ ...formData, servicio_id: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-primary"
              required
            >
              <option value="">Seleccione un servicio</option>
              <option value="1">Simulacro Tipo Examen (S/ 40.00)</option>
              <option value="2">Circuito Libre (S/ 40.00)</option>
              <option value="3">Paquete San Cristóbal</option>
              <option value="4">Asesoría en Trámites</option>
            </select>
          </div>

          <div>
            <label htmlFor="fecha" className="block mb-2 text-sm font-medium text-gray-300">
              Fecha y Hora
            </label>
            <input
              id="fecha"
              type="datetime-local"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="duracion_minutos" className="block mb-2 text-sm font-medium text-gray-300">
              Duración (minutos)
            </label>
            <input
              id="duracion_minutos"
              type="number"
              value={formData.duracion_minutos}
              onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-primary"
              required
              min="15"
              max="180"
            />
          </div>

          <div>
            <label htmlFor="notas" className="block mb-2 text-sm font-medium text-gray-300">
              Notas (opcional)
            </label>
            <textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formada, notas: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus-ring-primary h-24"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isLoading}>
              {selectedReserva ? 'Actualizar' : 'Crear Reserva'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reservas list */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Reservas</h2>
        {isLoading ? (
          <Loading className="mx-auto" />
        ) : (
          <div>
            {reservas.length > 0 ? (
              <DataTable
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'alumno_id', label: 'Alumno ID' },
                  { key: 'servicio_id', label: 'Servicio ID' },
                  { key: 'fecha', label: 'Fecha/Hora' },
                  { key: 'duracion_minutos', label: 'Duración' },
                  { key: 'estado', label: 'Estado' },
                  { key: 'acciones', label: 'Acciones' }
                ]}
                data={reservas}
                onRowClick={handleVerDetalles}
              />
            ) : (
              <p className="text-gray-400 text-center py-4">No hay reservas registradas</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}