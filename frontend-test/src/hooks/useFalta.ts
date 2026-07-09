import { useState, useCallback } from 'react';
import { faltaService } from '../services/faltaService';
import { FaltaPayload } from '../services/faltaService';

export const useFalta = () => {
  const [faltas, setFaltas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrar = useCallback(async (datos: FaltaPayload) => {
    setLoading(true);
    try {
      const data = await faltaService.registrar(datos);
      setFaltas(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar falta');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const porReserva = useCallback(async (reservaId: number) => {
    setLoading(true);
    try {
      const data = await faltaService.porReserva(reservaId);
      setFaltas(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener faltas de la reserva');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    faltas,
    loading,
    error,
    registrar,
    porReserva
  };
};