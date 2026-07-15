import { get } from '@/lib/api-client'
import type { AlumnoContract, PaginatedResponse, ReservaContract } from '@/lib/contracts'

export type AlumnoProfile = AlumnoContract
export type Reserva = ReservaContract

export interface Falta {
  id: string
  reserva_id: string
  tipo_falta: 'Leve' | 'Grave' | 'Eliminatoria'
  descripcion: string
  minuto_ocurrencia: number | null
  observaciones: string | null
  fecha_creacion: string
}

export async function getAlumnoProfile(): Promise<AlumnoProfile> {
  return get<AlumnoProfile>('/api/me')
}

export async function getAlumnoReservas(): Promise<Reserva[]> {
  const page = await get<PaginatedResponse<Reserva>>('/api/me/reservas?page_size=100')
  return page.items
}

export async function getReservaFaltas(reservaId: string): Promise<Falta[]> {
  return get<Falta[]>(`/api/me/reservas/${reservaId}/faltas`)
}
