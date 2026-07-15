interface ReservaConFechaCreacion {
  fecha_creacion: string
}

const limaDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' })

const obtenerFechaCalendarioLima = (value: string | Date): string | null => {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return limaDateFormatter.format(date)
}

export const contarReservasRegistradasHoy = (
  reservas: readonly ReservaConFechaCreacion[],
  now: Date = new Date(),
): number => {
  const hoy = obtenerFechaCalendarioLima(now)

  if (!hoy) return 0

  return reservas.filter((reserva) => obtenerFechaCalendarioLima(reserva.fecha_creacion) === hoy).length
}
