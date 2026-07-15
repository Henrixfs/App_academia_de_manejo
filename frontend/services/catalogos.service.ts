import { getPublic } from '@/lib/api-client'
import type { PaginatedResponse } from '@/lib/contracts'

export interface Servicio {
  id: string
  nombre: string
  descripcion: string
  tarifa: number
  tiempo_minimo_horas: number
}

export interface Paquete {
  id: string
  nombre: string
  descripcion: string
  precio_sugerido?: number
}

export async function getServicios(): Promise<Servicio[]> {
  const page = await getPublic<PaginatedResponse<Servicio>>('/api/servicios/?page_size=100')
  return page.items
}

export async function getPaquetes(): Promise<Paquete[]> {
  const page = await getPublic<PaginatedResponse<Paquete>>('/api/paquetes/?page_size=100')
  return page.items
}
