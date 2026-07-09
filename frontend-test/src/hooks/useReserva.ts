import { useState, useCallback } from 'react';
import { reservaService } from '../services/reservaService';
import { ReservaPayload } from '../services/reservaService';
import { FaltaPayload } from '../services/faltaService';

export const useReserva = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(async (skip = 0, limit = 100) => {
    setLoading(true);
    try {
      const data = await reservaService.listar(skip, limit);
      setReservas(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al listar reservas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const obtener = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await reservaService.obtener(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener reserva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = useCallback(async (datos: ReservaPayload) => {
    setLoading(true);
    try {
      const data = await reservaService.crear(datos);
      setReservas(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear reserva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const porAlumno = useCallback(async (alumnoId: number) => {
    setLoading(true);
    try {
      const data = await reservaService.porAlumno(alumnoId);
      setReservas(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener reservas del alumno');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelar = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await reservaService.cancelar(id);
      setReservas(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar reserva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reprogramar = useCallback(async (id: number, nuevaFecha: string) => {
    setLoading(true);
    try {
      const data = await reservaService.reprogramar(id, nuevaFecha);
      setReservas(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reprogramar reserva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reservas,
    loading,
    error,
    listar,
    obtener,
    crear,
    porAlumno,
    cancelar,
    reprogramar
  };
};