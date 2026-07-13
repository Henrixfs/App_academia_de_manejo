import { get, post } from '@/lib/api-client'

export interface Servicio {
  id: string
  nombre: string
  descripcion: string
  tarifa: number
  tiempo_minimo_horas: number
}

export interface Alumno {
  id: string
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email: string | null
}

export interface Reserva {
  id: string
  alumno_id: string
  servicio_id: string
  matricula_paquete_id: string | null
  fecha_hora_inicio: string
  fecha_hora_fin: string
  estado: string
  estado_pago: string
  fecha_creacion: string
  alumno?: Alumno
  servicio?: Servicio
}

export interface ReservaCreate {
  alumno_id: string
  servicio_id: string
  matricula_paquete_id?: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
}

// Coincide exactamente con el backend ReprogramarRequest
export interface ReprogramarData {
  nueva_fecha_hora_inicio: string
  nueva_fecha_hora_fin: string
}

export async function getReservas(): Promise<Reserva[]> {
  return get<Reserva[]>('/api/reservas/')
}

export async function getReserva(id: string): Promise<Reserva> {
  return get<Reserva>(`/api/reservas/${id}`)
}

export async function getServicios(): Promise<Servicio[]> {
  return get<Servicio[]>('/api/servicios/')
}

export async function createReserva(data: ReservaCreate): Promise<Reserva> {
  return post<Reserva>('/api/reservas/', data)
}

export async function cancelarReserva(id: string): Promise<Reserva> {
  return post<Reserva>(`/api/reservas/${id}/cancelar`, {})
}

export async function reprogramarReserva(id: string, data: ReprogramarData): Promise<Reserva> {
  return post<Reserva>(`/api/reservas/${id}/reprogramar`, data)
}

export async function confirmarReserva(id: string): Promise<Reserva> {
  return post<Reserva>(`/api/reservas/${id}/confirmar`, {})
}
