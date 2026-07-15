export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export type ReservaEstado =
  | 'pendiente_confirmacion'
  | 'confirmada'
  | 'asistida'
  | 'no_asistio'
  | 'cancelada'
  | 'reprogramada'

export type EstadoPago = 'pendiente' | 'pagado_presencial'

export interface AlumnoContract {
  id: string
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email: string | null
  fecha_registro: string
}

export interface ServicioContract {
  id: string
  nombre: string
  descripcion: string
  tarifa: number
  tiempo_minimo_horas: number
}

export interface ReservaContract {
  id: string
  alumno_id: string
  servicio_id: string
  matricula_paquete_id: string | null
  fecha_hora_inicio: string
  fecha_hora_fin: string
  estado: ReservaEstado
  estado_pago: EstadoPago
  reprogramaciones_usadas: number
  fecha_creacion: string
}
