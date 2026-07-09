import api from './api';

export interface ReservaPayload {
  alumno_id: number;
  servicio_id: number;
  fecha: string; // ISO 8601 datetime
  duracion_minutos: number;
  notas?: string;
}

export const reservaService = {
  async crear(datos: ReservaPayload) {
    const response = await api.post('/reservas/', datos);
    return response.data;
  },

  async listar(skip = 0, limit = 100) {
    const response = await api.get('/reservas/', {
      params: { skip, limit },
    });
    return response.data;
  },

  async obtener(id: number) {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  async actualizar(id: number, datos: Partial<ReservaPayload>) {
    const response = await api.put(`/reservas/${id}`, datos);
    return response.data;
  },

  async porAlumno(alumnoId: number) {
    const response = await api.get(`/reservas/alumno/${alumnoId}`);
    return response.data;
  },

  async cancelar(id: number) {
    const response = await api.post(`/reservas/${id}/cancelar`);
    return response.data;
  },

  async reprogramar(id: number, nuevaFecha: string) {
    const response = await api.post(`/reservas/${id}/reprogramar`, {
      nueva_fecha: nuevaFecha,
    });
    return response.data;
  },
};