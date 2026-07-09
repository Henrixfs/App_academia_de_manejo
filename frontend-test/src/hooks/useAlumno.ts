import { useState, useCallback } from 'react';
import { alumnoService } from '../services/alumnoService';
import { User } from '../types/models';

export const useAlumno = () => {
  const [alumnos, setAlumnos] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(async (skip = 0, limit = 100) => {
    setLoading(true);
    try {
      const data = await alumnoService.listar(skip, limit);
      setAlumnos(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al listar alumnos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const obtener = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await alumnoService.obtener(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener alumno');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = useCallback(async (datos: { nombre: string; email: string; telefono?: string }) => {
    setLoading(true);
    try {
      const data = await alumnoService.crear(datos);
      setAlumnos(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear alumno');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizar = useCallback(async (id: number, datos: Partial<User>) => {
    setLoading(true);
    try {
      const data = await alumnoService.actualizar(id, datos);
      setAlumnos(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar alumno');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminar = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await alumnoService.eliminar(id);
      setAlumnos(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar alumno');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    alumnos,
    loading,
    error,
    listar,
    obtener,
    crear,
    actualizar,
    eliminar
  };
};