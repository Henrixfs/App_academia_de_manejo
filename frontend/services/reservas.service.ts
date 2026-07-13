import { get, post } from '@/lib/api-client'

export interface Reserva {
  id: string
  alumno_id: string
  servicio_id: string
  matricula_paquete_id?: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
  estado: 'pendiente_confirmacion' | 'confirmada' | 'asistida' | 'no_asistio' | 'cancelada' | 'reprogramada'
  estado_pago: 'pendiente' | 'pagado_presencial'
  fecha_creacion: string
  servicio?: {
    id: string
    nombre: string
    descripcion: string
    tarifa: number
  }
  alumno?: {
    id: string
    nombres: string
    apellidos: string
  }
}

export interface ReservaCreate {
  alumno_id: string
  servicio_id: string
  matricula_paquete_id?: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
}

export interface ReprogramarRequest {
  nueva_fecha_hora_inicio: string
  nueva_fecha_hora_fin: string
}

export async function getReservas(): Promise<Reserva[]> {
  return get<Reserva[]>('/api/reservas/')
}

export async function getReserva(id: string): Promise<Reserva> {
  return get<Reserva>(`/api/reservas/${id}`)
}

export async function createReserva(data: ReservaCreate): Promise<Reserva> {
  return post<Reserva>('/api/reservas/', data)
}

export async function reprogramarReserva(id: string, data: ReprogramarRequest): Promise<Reserva> {
  return post<Reserva>(`/api/reservas/${id}/reprogramar`, data)
}

export async function cancelarReserva(id: string): Promise<Reserva> {
  return post<Reserva>(`/api/reservas/${id}/cancelar`, {})
}
