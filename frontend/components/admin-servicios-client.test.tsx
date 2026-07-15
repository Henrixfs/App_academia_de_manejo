import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AdminServiciosClient } from '@/app/admin/servicios/servicios-client'

describe('AdminServiciosClient', () => {
  it('muestra los servicios sin el panel de reglas de negocio', () => {
    render(
      <AdminServiciosClient
        initialServicios={[{
          id: 'servicio-1',
          nombre: 'Circuito Libre',
          descripcion: 'Práctica controlada',
          tarifa: 60,
          tiempo_minimo_horas: 2,
        }]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Servicios' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Nuevo Servicio' })).toBeEnabled()
    expect(screen.getByText('Circuito Libre')).toBeVisible()
    expect(screen.queryByText('Reglas de Negocio Oficiales (Specs)')).not.toBeInTheDocument()
    expect(screen.queryByText(/RN01/)).not.toBeInTheDocument()
    expect(screen.queryByText(/RN02/)).not.toBeInTheDocument()
    expect(screen.queryByText(/RN03/)).not.toBeInTheDocument()
  })
})
