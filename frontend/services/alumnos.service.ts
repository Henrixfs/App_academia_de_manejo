import { get, post, put, del } from '@/lib/api-client'

export interface Alumno {
  id: string
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email?: string
  fecha_registro: string
}

export interface AlumnoCreate {
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email?: string
}

export async function getAlumnos(): Promise<Alumno[]> {
  return get<Alumno[]>('/api/alumnos/')
}

export async function getAlumno(id: string): Promise<Alumno> {
  return get<Alumno>(`/api/alumnos/${id}`)
}

export async function createAlumno(data: AlumnoCreate): Promise<Alumno> {
  return post<Alumno>('/api/alumnos/', data)
}

export async function updateAlumno(id: string, data: Partial<AlumnoCreate>): Promise<Alumno> {
  return put<Alumno>(`/api/alumnos/${id}`, data)
}

export async function deleteAlumno(id: string): Promise<void> {
  return del<void>(`/api/alumnos/${id}`)
}
