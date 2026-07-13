import { get } from '@/lib/api-client'

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
  return get<Servicio[]>('/api/servicios/')
}

export async function getPaquetes(): Promise<Paquete[]> {
  return get<Paquete[]>('/api/paquetes/')
}
