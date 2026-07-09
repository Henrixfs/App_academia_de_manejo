import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reservaService } from '../services/reservaService';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import Badge from '../components/Common/Badge';

export default function DashboardAlumno() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      cargarReservas();
    }
  }, [user]);

  const cargarReservas = async () => {
    try {
      setIsLoading(true);
      const data = await reservaService.porAlumno(user!.id);
      setReservas(data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  const proximaReserva = reservas.find((r: any) =>
    r.estado === 'CONFIRMADA' || r.estado === 'REPROGRAMADA'
  );

  return (
    <div className="dashboard-alumno p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">¡Hola, {user?.nombre}! 👋</h1>
        {proximaReserva && (
          <p className="mt-2 text-gray-400">
            Tu próxima sesión es el {new Date(proximaReserva.fecha).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Próxima Reserva</h2>
          {proximaReserva ? (
            <>
              <p className="mb-2"><strong>Servicio:</strong> {proximaReserva.servicio_id}</p>
              <p className="mb-2"><strong>Fecha:</strong> {new Date(proximaReserva.fecha).toLocaleString()}</p>
              <p className="mb-2"><strong>Duración:</strong> {proximaReserva.duracion_minutos} minutos</p>
              <Button
                onClick={() => window.location.href = `/reservas/${proximaReserva.id}`}
                className="w-full mt-4"
              >
                Ver Detalles
              </Button>
            </>
          ) : (
            <p className="text-gray-400">No tienes reservas próximas</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Servicios Disponibles</h2>
          <div className="space-y-3">
            <Button className="w-full">Simulacro Tipo Examen (S/ 40.00)</Button>
            <Button className="w-full">Circuito Libre (S/ 40.00)</Button>
            <Button className="w-full">Paquete San Cristóbal</Button>
            <Button className="w-full">Asesoría en Trámites</Button>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Mis Reservas</h2>
        {reservas.length > 0 ? (
          <div className="space-y-4">
            {reservas.map((reserva: any) => (
              <Card key={reserva.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium"><strong>Servicio:</strong> {reserva.servicio_id}</p>
                    <p className="text-sm text-gray-400"><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={reserva.estado === 'CONFIRMADA' ? 'success' : reserva.estado === 'CANCELADA' ? 'danger' : 'warning'}>
                      {reserva.estado}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No tienes reservas</p>
        )}
      </div>
    </div>
  );
}