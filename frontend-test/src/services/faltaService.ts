import api from './api';

export interface FaltaPayload {
  reserva_id: number;
  tipo: 'LEVE' | 'GRAVE' | 'ELIMINATORIA';
  descripcion: string;
}

export const faltaService = {
  async registrar(datos: FaltaPayload) {
    const response = await api.post('/faltas/', datos);
    return response.data;
  },

  async porReserva(reservaId: number) {
    const response = await api.get(`/faltas/reserva/${reservaId}`);
    return response.data;
  },
};