import 'server-only'

const API_BASE_URL = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:8000'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email: string
  password: string
}

export interface InitialAdminSetupRequest {
  email: string
  nombres: string
  apellidos: string
  telefono?: string
  password: string
}

export interface InitialSetupStatus {
  setup_required: boolean
}

export interface User {
  id: string
  email: string
  nombres: string
  apellidos: string
  rol: 'alumno' | 'administrador'
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface ApiErrorResponse {
  message?: string
  detail?: string
}

const responseErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  const error = await response.json().catch(() => ({})) as ApiErrorResponse
  return error.message || error.detail || fallback
}

const requestToken = async <T>(path: string, data: T, fallback: string): Promise<TokenResponse> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(await responseErrorMessage(response, fallback))
  return response.json() as Promise<TokenResponse>
}

const authenticateWithToken = async (tokenData: TokenResponse): Promise<LoginResponse> => {
  const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
    cache: 'no-store',
  })
  if (!userResponse.ok) throw new Error('No se pudo obtener el perfil del usuario')
  const user = await userResponse.json() as User
  return { ...tokenData, user }
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => (
  authenticateWithToken(await requestToken('/api/auth/login', data, 'Error al iniciar sesión'))
)

export const register = async (data: RegisterRequest): Promise<LoginResponse> => (
  authenticateWithToken(await requestToken('/api/auth/register', data, 'Error al registrar usuario'))
)

export const getInitialSetupStatus = async (): Promise<InitialSetupStatus> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/setup/status`, { cache: 'no-store' })
  if (!response.ok) throw new Error(await responseErrorMessage(response, 'No se pudo comprobar la configuración inicial'))
  return response.json() as Promise<InitialSetupStatus>
}

export const setupInitialAdmin = async (data: InitialAdminSetupRequest): Promise<LoginResponse> => (
  authenticateWithToken(await requestToken('/api/auth/setup/administrator', data, 'No se pudo crear el administrador inicial'))
)
