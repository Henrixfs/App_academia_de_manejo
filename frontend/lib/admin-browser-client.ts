interface ApiErrorBody {
  code?: string
  message?: string
  detail?: string
}

interface AdminRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

export class AdminApiError extends Error {
  status: number
  code: string | null

  constructor(message: string, status: number, code: string | null) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
    this.code = code
  }
}

const responseMessage = (body: ApiErrorBody | null, status: number): string => (
  body?.message || body?.detail || `La operación falló con HTTP ${status}`
)

const parseError = async (response: Response): Promise<ApiErrorBody | null> => {
  if (!response.headers.get('content-type')?.includes('application/json')) return null
  return response.json() as Promise<ApiErrorBody>
}

export const adminRequest = async <T>(path: string, options: AdminRequestOptions = {}): Promise<T> => {
  const response = await fetch(`/api/admin/${path.replace(/^\/+/, '')}`, {
    method: options.method || 'GET',
    headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
    credentials: 'same-origin',
  })

  if (!response.ok) {
    const body = await parseError(response)
    throw new AdminApiError(responseMessage(body, response.status), response.status, body?.code || null)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const adminGet = async <T>(path: string): Promise<T> => adminRequest<T>(path)
export const adminPost = async <T>(path: string, data?: unknown): Promise<T> => adminRequest<T>(path, { method: 'POST', body: data })
export const adminPut = async <T>(path: string, data?: unknown): Promise<T> => adminRequest<T>(path, { method: 'PUT', body: data })
export const adminDelete = async <T>(path: string): Promise<T> => adminRequest<T>(path, { method: 'DELETE' })
