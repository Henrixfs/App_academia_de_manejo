import 'server-only'

import { API_BASE_URL } from '@/lib/api-client'
import { requireRole } from '@/lib/dal'

const allowedResources = new Set(['alumnos', 'reservas', 'servicios'])

const errorResponse = (status: number, code: string, message: string): Response => Response.json({ code, message }, { status })

const isAllowedPath = (path: string[]): boolean => (
  path.length > 0
  && allowedResources.has(path[0])
  && path.every((segment) => /^[a-zA-Z0-9_-]+$/.test(segment))
)

const responseHeaders = (response: Response): Headers => {
  const headers = new Headers()
  const contentType = response.headers.get('content-type')
  const requestId = response.headers.get('x-request-id')
  if (contentType) headers.set('content-type', contentType)
  if (requestId) headers.set('x-request-id', requestId)
  return headers
}

const backendPath = (path: string[]): string => path.length === 1 ? `${path[0]}/` : path.join('/')

export const proxyAdminRequest = async (request: Request, path: string[]): Promise<Response> => {
  if (!isAllowedPath(path)) return errorResponse(404, 'NOT_FOUND', 'Ruta administrativa no disponible')

  let session
  try {
    session = await requireRole(['administrador'])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No autorizado'
    const status = message === 'Forbidden' ? 403 : 401
    return errorResponse(status, status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED', 'No tienes autorización para esta operación')
  }

  const body = ['POST', 'PUT', 'PATCH'].includes(request.method) ? await request.text() : undefined
  if (body) {
    try {
      JSON.parse(body)
    } catch {
      return errorResponse(400, 'INVALID_JSON', 'El cuerpo de la solicitud debe ser JSON válido')
    }
  }

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/api/admin/${backendPath(path)}`, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
      cache: 'no-store',
    })
    return new Response(await backendResponse.text(), {
      status: backendResponse.status,
      headers: responseHeaders(backendResponse),
    })
  } catch {
    return errorResponse(503, 'BACKEND_UNAVAILABLE', 'No se pudo conectar con el servicio de la academia')
  }
}
