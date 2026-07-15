'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { encrypt } from '@/lib/session'
import { login as apiLogin, setupInitialAdmin as apiSetupInitialAdmin, type LoginResponse } from '@/services/auth.service'

const LoginSchema = z.object({
  username: z.string().trim().min(1, 'Documento o email requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

const SetupSchema = z.object({
  email: z.email('Ingresa un email válido'),
  nombres: z.string().trim().min(1, 'Los nombres son obligatorios'),
  apellidos: z.string().trim().min(1, 'Los apellidos son obligatorios'),
  telefono: z.string().trim().max(20, 'El teléfono no puede superar 20 caracteres').optional(),
  password: z.string().min(10, 'La contraseña debe tener al menos 10 caracteres').regex(/[A-Za-z]/, 'La contraseña debe incluir letras').regex(/\d/, 'La contraseña debe incluir números'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  path: ['password_confirmation'],
  message: 'Las contraseñas no coinciden',
})

export interface LoginState {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
  redirectUrl?: string
}

export interface SetupState {
  errors?: {
    email?: string[]
    nombres?: string[]
    apellidos?: string[]
    telefono?: string[]
    password?: string[]
    password_confirmation?: string[]
  }
  message?: string
  success?: boolean
}

const persistSession = async (response: LoginResponse): Promise<void> => {
  const expiresAt = Math.floor(Date.now() / 1000) + response.expires_in
  const encryptedSession = await encrypt({
    userId: response.user.id,
    email: response.user.email,
    rol: response.user.rol,
    nombres: response.user.nombres,
    apellidos: response.user.apellidos,
    accessToken: response.access_token,
  }, expiresAt)
  const cookieStore = await cookies()
  cookieStore.set('session', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: response.expires_in,
    priority: 'high',
  })
}

export const login = async (_state: LoginState, formData: FormData): Promise<LoginState> => {
  const validated = LoginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }
  try {
    const response = await apiLogin(validated.data)
    await persistSession(response)
    return {
      success: true,
      redirectUrl: response.user.rol === 'administrador' ? '/admin' : '/cuenta',
    }
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Error al iniciar sesión' }
  }
}

export const setupInitialAdmin = async (_state: SetupState, formData: FormData): Promise<SetupState> => {
  const validated = SetupSchema.safeParse({
    email: formData.get('email'),
    nombres: formData.get('nombres'),
    apellidos: formData.get('apellidos'),
    telefono: formData.get('telefono') || undefined,
    password: formData.get('password'),
    password_confirmation: formData.get('password_confirmation'),
  })
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }
  try {
    const response = await apiSetupInitialAdmin({
      email: validated.data.email,
      nombres: validated.data.nombres,
      apellidos: validated.data.apellidos,
      telefono: validated.data.telefono,
      password: validated.data.password,
    })
    await persistSession(response)
    return { success: true }
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'No se pudo crear el administrador inicial' }
  }
}

export const logout = async (): Promise<never> => {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
