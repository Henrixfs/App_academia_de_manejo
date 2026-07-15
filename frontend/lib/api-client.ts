import 'server-only'

import { requireAuth } from '@/lib/dal'


export const API_BASE_URL = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:8000'

interface ApiValidationItem {
  msg?: string
}

interface ApiErrorBody {
  code?: string
  message?: string
  detail?: string | ApiValidationItem[]
  request_id?: string
  errors?: ApiValidationItem[]
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  authenticated?: boolean
}

const validationMessageFrom = (items?: ApiValidationItem[]): string | null => {
  const message = items?.map((item) => item.msg).filter(Boolean).join('. ')
  return message || null
}

const apiErrorMessage = (error: ApiErrorBody | null, status: number, endpoint: string): string => {
  const validationMessage = validationMessageFrom(error?.errors)
    || (Array.isArray(error?.detail) ? validationMessageFrom(error.detail) : null)
  const detail = typeof error?.detail === 'string' ? error.detail : null
  return error?.message || validationMessage || detail || `El backend respondio HTTP ${status} en ${endpoint}`
}

export const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (options.authenticated !== false) {
    const session = await requireAuth()
    headers.Authorization = `Bearer ${session.accessToken}`
  }
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
    })
  } catch {
    throw new Error(`No se pudo conectar con el backend en ${API_BASE_URL}`)
  }
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    const error = contentType.includes('application/json')
      ? await response.json() as ApiErrorBody
      : null
    throw new Error(apiErrorMessage(error, response.status, endpoint))
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const get = async <T>(endpoint: string): Promise<T> => request<T>(endpoint)
export const getPublic = async <T>(endpoint: string): Promise<T> => request<T>(endpoint, { authenticated: false })
export const post = async <T>(endpoint: string, data?: unknown): Promise<T> => request<T>(endpoint, { method: 'POST', body: data })
export const put = async <T>(endpoint: string, data?: unknown): Promise<T> => request<T>(endpoint, { method: 'PUT', body: data })
export const del = async <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'DELETE' })
