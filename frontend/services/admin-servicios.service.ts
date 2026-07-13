import { get, post, put, del } from '@/lib/api-client'

export interface Servicio {
  id: string
  nombre: string
  descripcion: string
  tarifa: number
  tiempo_minimo_horas: number
}

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

export async function getServicios(): Promise<Servicio[]> {
  return get<Servicio[]>('/api/servicios/')
}

export async function getServicio(id: string): Promise<Servicio> {
  return get<Servicio>(`/api/servicios/${id}`)
}

export async function createServicio(data: ServicioCreate): Promise<Servicio> {
  return post<Servicio>('/api/servicios/', data)
}

export async function updateServicio(id: string, data: ServicioUpdate): Promise<Servicio> {
  return put<Servicio>(`/api/servicios/${id}`, data)
}

export async function deleteServicio(id: string): Promise<void> {
  return del<void>(`/api/servicios/${id}`)
}
