import api from './api';
import { User } from '../types/models';

export const alumnoService = {
  // Crear alumno (registro)
  async crear(datos: {
    nombre: string;
    email: string;
    telefono?: string;
  }): Promise<User> {
    const response = await api.post('/alumnos/', datos);
    return response.data;
  },

  // Obtener todos
  async listar(skip = 0, limit = 100): Promise<User[]> {
    const response = await api.get('/alumnos/', {
      params: { skip, limit },
    });
    return response.data;
  },

  // Obtener uno
  async obtener(id: number): Promise<User> {
    const response = await api.get(`/alumnos/${id}`);
    return response.data;
  },

  // Actualizar
  async actualizar(
    id: number,
    datos: Partial<User>
  ): Promise<User> {
    const response = await api.put(`/alumnos/${id}`, datos);
    return response.data;
  },

  // Eliminar
  async eliminar(id: number): Promise<void> {
    await api.delete(`/alumnos/${id}`);
  },
};