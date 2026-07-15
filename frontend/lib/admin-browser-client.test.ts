import { afterEach, describe, expect, it, vi } from 'vitest'

import { adminDelete, adminPost } from '@/lib/admin-browser-client'

describe('admin browser client', () => {
  afterEach((): void => {
    vi.unstubAllGlobals()
  })

  it('envía mutaciones al BFF sin exponer un token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'alumno-1' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(adminPost<{ id: string }>('alumnos', { nombres: 'Ana' })).resolves.toEqual({ id: 'alumno-1' })
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/alumnos', expect.objectContaining({
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombres: 'Ana' }),
    }))
  })

  it('no intenta leer JSON cuando el backend confirma una eliminación', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))

    await expect(adminDelete<void>('alumnos/alumno-1')).resolves.toBeUndefined()
  })

  it('conserva el mensaje y el código de error devuelto por el BFF', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: 'RESERVA_DUPLICADA',
      message: 'El horario ya está ocupado',
    }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    })))

    await expect(adminPost('reservas', {})).rejects.toMatchObject({
      name: 'AdminApiError',
      status: 409,
      code: 'RESERVA_DUPLICADA',
      message: 'El horario ya está ocupado',
    })
  })
})
