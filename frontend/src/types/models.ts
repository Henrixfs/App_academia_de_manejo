export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'alumno' | 'admin';
  telefono?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Reserva {
  id: number;
  alumno_id: number;
  servicio_id: number;
  fecha: string; // ISO 8601
  duracion_minutos_minutos: number;
  estado: string; // Could be enum: 'PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA'
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Falta {
  id: number;
  reserva_id: number;
  tipo: 'LEVE' | 'GRAVE' | 'ELIMINATORIA';
  descripcion: string;
  created_at?: string;
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_semanas: number;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}