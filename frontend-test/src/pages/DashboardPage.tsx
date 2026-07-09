import { useAuth } from '../context/AuthContext';
import DashboardAlumno from './DashboardAlumno';
import DashboardAdmin from './DashboardAdmin';

export default function DashboardPage() {
  const { isAlumno, isAdmin } = useAuth();

  if (isAlumno) {
    return <DashboardAlumno />;
  }

  if (isAdmin) {
    return <DashboardAdmin />;
  }

  // Fallback (should not happen if authenticated)
  return <div>Cargando...</div>;
}