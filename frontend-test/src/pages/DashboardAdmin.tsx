import { useEffect, useState } from 'react';
import { reservaService } from '../services/reservaService';
import { alumnoService } from '../services/alumnoService';
import DataTable from '../components/Common/DataTable';
import Card from '../components/Common/Card';
import Loading from '../components/Common/Loading';

export default function DashboardAdmin() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

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

  if (isLoading) return <Loading />;

  const hoy = new Date().toDateString();
  const reservasHoy = reservas.filter(
    (r: any) => new Date(r.fecha).toDateString() === hoy
  );

  return (
    <div className="dashboard-admin p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Panel de Administración</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Alumnos Registrados</h3>
          <p className="text-2xl font-bold text-primary">{alumnos.length}</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Reservas Hoy</h3>
          <p className="text-2xl font-bold text-primary">{reservasHoy.length}</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Reservas Próximas</h3>
          <p className="text-2xl font-bold text-primary">
            {reservas.filter((r: any) => r.estado === 'CONFIRMADA').length}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Completadas Este Mes</h3>
          <p className="text-2xl font-bold text-primary">
            {reservas.filter((r: any) => r.estado === 'COMPLETADA').length}
          </p>
        </Card>
      </div>

      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Reservas de Hoy</h2>
          {reservasHoy.length > 0 ? (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'alumno_id', label: 'Alumno ID' },
                { key: 'fecha', label: 'Fecha/Hora' },
                { key: 'estado', label: 'Estado' },
              ]}
              data={reservasHoy}
            />
          ) : (
            <p className="text-gray-400 text-center py-4">No hay reservas para hoy</p>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Alumnos</h2>
        {alumnos.length > 0 ? (
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'nombre', label: 'Nombre' },
              { key: 'email', label: 'Email' },
              { key: 'telefono', label: 'Teléfono' },
            ]}
            data={alumnos}
          />
        ) : (
          <p className="text-gray-400 text-center py-4">No hay alumnos registrados</p>
        )}
      </Card>
    </div>
  );
}