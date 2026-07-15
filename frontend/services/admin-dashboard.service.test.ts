import { describe, expect, it } from 'vitest'

import { contarReservasRegistradasHoy } from '@/services/admin-dashboard.service'

describe('contarReservasRegistradasHoy', () => {
  it('cuenta solamente las reservas registradas en la fecha actual de Lima', () => {
    const reservas = [
      { fecha_creacion: '2026-07-14T00:30:00Z' },
      { fecha_creacion: '2026-07-14T05:00:00Z' },
      { fecha_creacion: '2026-07-14T20:00:00Z' },
      { fecha_creacion: '2026-07-15T05:00:00Z' },
    ]

    expect(contarReservasRegistradasHoy(reservas, new Date('2026-07-14T12:00:00Z'))).toBe(2)
  })

  it('ignora fechas de creación inválidas', () => {
    const reservas = [
      { fecha_creacion: 'fecha-invalida' },
      { fecha_creacion: '2026-07-14T13:00:00Z' },
    ]

    expect(contarReservasRegistradasHoy(reservas, new Date('2026-07-14T12:00:00Z'))).toBe(1)
  })
})
