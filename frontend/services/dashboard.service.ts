import { get } from '@/lib/api-client'

export interface AlumnoProfile {
  id: string
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email: string | null
  fecha_registro: string
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
}

export interface Falta {
  id: string
  reserva_id: string
  tipo_falta: 'Leve' | 'Grave' | 'Eliminatoria'
  descripcion: string
  minuto_ocurrencia: number | null
  observaciones: string | null
  fecha_creacion: string
}

export async function getAlumnoProfile(alumnoId: string): Promise<AlumnoProfile> {
  return get<AlumnoProfile>(`/api/alumnos/${alumnoId}`)
}

export async function getAlumnoReservas(alumnoId: string): Promise<Reserva[]> {
  return get<Reserva[]>(`/api/reservas/alumno/${alumnoId}`)
}

export async function getReservaFaltas(reservaId: string): Promise<Falta[]> {
  return get<Falta[]>(`/api/faltas/reserva/${reservaId}`)
}
