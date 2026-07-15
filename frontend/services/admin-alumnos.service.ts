import { get, post, put, del } from '@/lib/api-client'
import type { AlumnoContract, PaginatedResponse } from '@/lib/contracts'

export type Alumno = AlumnoContract

export interface AlumnoCreate {
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email?: string
}

export interface AlumnoUpdate {
  nombres?: string
  apellidos?: string
  documento_identidad?: string
  telefono?: string
  email?: string
}

export async function getAlumnos(): Promise<Alumno[]> {
  const page = await get<PaginatedResponse<Alumno>>('/api/admin/alumnos/?page_size=100')
  return page.items
}

export async function getAlumno(id: string): Promise<Alumno> {
  return get<Alumno>(`/api/admin/alumnos/${id}`)
}

export async function createAlumno(data: AlumnoCreate): Promise<Alumno> {
  return post<Alumno>('/api/admin/alumnos/', data)
}

export async function updateAlumno(id: string, data: AlumnoUpdate): Promise<Alumno> {
  return put<Alumno>(`/api/admin/alumnos/${id}`, data)
}

export async function deleteAlumno(id: string): Promise<void> {
  return del<void>(`/api/admin/alumnos/${id}`)
}
