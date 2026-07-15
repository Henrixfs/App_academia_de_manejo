import { get, post } from '@/lib/api-client'
import type { AlumnoContract, PaginatedResponse, ReservaContract, ServicioContract } from '@/lib/contracts'

export type Servicio = ServicioContract
export type Alumno = Omit<AlumnoContract, 'fecha_registro'>
export type Reserva = ReservaContract & { alumno?: Alumno; servicio?: Servicio }

export interface ReservaCreate {
  alumno_id: string
  servicio_id: string
  matricula_paquete_id?: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
}

export interface ReprogramarData {
  nueva_fecha_hora_inicio: string
  nueva_fecha_hora_fin: string
}

const normalizeServicio = (servicio: ServicioContract): Servicio => ({
  ...servicio,
  tarifa: Number(servicio.tarifa),
})

export async function getReservas(): Promise<Reserva[]> {
  const page = await get<PaginatedResponse<Reserva>>('/api/admin/reservas/?page_size=100')
  return page.items
}

export async function getReserva(id: string): Promise<Reserva> {
  return get<Reserva>(`/api/admin/reservas/${id}`)
}

export async function getServicios(): Promise<Servicio[]> {
  const page = await get<PaginatedResponse<Servicio>>('/api/servicios/?page_size=100')
  return page.items.map(normalizeServicio)
}

export async function createReserva(data: ReservaCreate): Promise<Reserva> {
  return post<Reserva>('/api/admin/reservas/', data)
}

export async function cancelarReserva(id: string): Promise<Reserva> {
  return post<Reserva>(`/api/admin/reservas/${id}/cancelar`, {})
}

export async function reprogramarReserva(id: string, data: ReprogramarData): Promise<Reserva> {
  return post<Reserva>(`/api/admin/reservas/${id}/reprogramar`, data)
}

export async function confirmarReserva(id: string): Promise<Reserva> {
  return post<Reserva>(`/api/admin/reservas/${id}/confirmar`, {})
}
