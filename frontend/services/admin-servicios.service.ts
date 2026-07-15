import { get, post, put, del } from '@/lib/api-client'
import type { PaginatedResponse, ServicioContract } from '@/lib/contracts'

export type Servicio = ServicioContract

export interface ServicioCreate {
  nombre: string
  descripcion: string
  tarifa: number
  tiempo_minimo_horas: number
}

export interface ServicioUpdate {
  nombre?: string
  descripcion?: string
  tarifa?: number
  tiempo_minimo_horas?: number
}

const normalizeServicio = (servicio: ServicioContract): Servicio => ({
  ...servicio,
  tarifa: Number(servicio.tarifa),
})

export async function getServicios(): Promise<Servicio[]> {
  const page = await get<PaginatedResponse<Servicio>>('/api/servicios/?page_size=100')
  return page.items.map(normalizeServicio)
}

export async function getServicio(id: string): Promise<Servicio> {
  const servicio = await get<Servicio>(`/api/servicios/${id}`)
  return normalizeServicio(servicio)
}

export async function createServicio(data: ServicioCreate): Promise<Servicio> {
  const servicio = await post<Servicio>('/api/admin/servicios/', data)
  return normalizeServicio(servicio)
}

export async function updateServicio(id: string, data: ServicioUpdate): Promise<Servicio> {
  const servicio = await put<Servicio>(`/api/admin/servicios/${id}`, data)
  return normalizeServicio(servicio)
}

export async function deleteServicio(id: string): Promise<void> {
  return del<void>(`/api/admin/servicios/${id}`)
}
