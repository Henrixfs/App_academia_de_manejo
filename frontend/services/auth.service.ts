const API_BASE_URL = process.env.API_URL || 'http://localhost:8000'

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
  user: User
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!loginResponse.ok) {
    const error = await loginResponse.json().catch(() => ({ detail: 'Login failed' }))
    throw new Error(error.detail || 'Login failed')
  }

  const tokenData = await loginResponse.json()

  const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  })

  if (!userResponse.ok) {
    throw new Error('Failed to get user info')
  }

  const user = await userResponse.json()

  return {
    access_token: tokenData.access_token,
    token_type: tokenData.token_type,
    user: user
  }
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!registerResponse.ok) {
    const error = await registerResponse.json().catch(() => ({ detail: 'Registration failed' }))
    throw new Error(error.detail || 'Registration failed')
  }

  const tokenData = await registerResponse.json()

  const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  })

  if (!userResponse.ok) {
    throw new Error('Failed to get user info')
  }

  const user = await userResponse.json()

  return {
    access_token: tokenData.access_token,
    token_type: tokenData.token_type,
    user: user
  }
}
