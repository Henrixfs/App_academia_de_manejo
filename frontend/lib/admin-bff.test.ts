import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  requireRole: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('@/lib/api-client', () => ({ API_BASE_URL: 'http://backend.test' }))
vi.mock('@/lib/dal', () => ({ requireRole: mocks.requireRole }))

import { proxyAdminRequest } from '@/lib/admin-bff'

describe('admin BFF', () => {
  afterEach((): void => {
    mocks.requireRole.mockReset()
    vi.unstubAllGlobals()
  })

  it('autoriza al administrador y reenvía la operación al backend desde el servidor', async () => {
    mocks.requireRole.mockResolvedValue({ accessToken: 'jwt-interno' })
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'alumno-1' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'X-Request-ID': 'request-1' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    const request = new Request('http://localhost:3000/api/admin/alumnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombres: 'Ana' }),
    })

    const response = await proxyAdminRequest(request, ['alumnos'])

    expect(mocks.requireRole).toHaveBeenCalledWith(['administrador'])
    expect(fetchMock).toHaveBeenCalledWith('http://backend.test/api/admin/alumnos/', expect.objectContaining({
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-interno',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombres: 'Ana' }),
    }))
    await expect(response.json()).resolves.toEqual({ id: 'alumno-1' })
    expect(response.headers.get('x-request-id')).toBe('request-1')
  })

  it('rechaza solicitudes sin una sesión administrativa', async () => {
    mocks.requireRole.mockRejectedValue(new Error('Unauthorized'))
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const response = await proxyAdminRequest(new Request('http://localhost:3000/api/admin/reservas'), ['reservas'])

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toMatchObject({ code: 'UNAUTHORIZED' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('no expone recursos administrativos fuera de la lista permitida', async () => {
    const response = await proxyAdminRequest(new Request('http://localhost:3000/api/admin/administradores'), ['administradores'])

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toMatchObject({ code: 'NOT_FOUND' })
  })
})
