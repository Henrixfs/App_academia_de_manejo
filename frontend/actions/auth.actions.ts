'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { login as apiLogin } from '@/services/auth.service'
import { encrypt } from '@/lib/session'

const LoginSchema = z.object({
  username: z.string().min(1, 'Documento o email requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export type LoginState = {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
  redirectUrl?: string
}

export async function login(state: LoginState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const response = await apiLogin(validatedFields.data)

    const cookieStore = await cookies()

    cookieStore.set('access_token', response.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set('auth_token', response.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    const sessionVal = await encrypt({
      userId: response.user.id,
      email: response.user.email,
      rol: response.user.rol,
      nombres: response.user.nombres,
      apellidos: response.user.apellidos,
    })

    cookieStore.set('session', sessionVal, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      redirectUrl: '/admin',
    }
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Error al iniciar sesión',
    }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('auth_token')
  cookieStore.delete('session')
  redirect('/login')
}
