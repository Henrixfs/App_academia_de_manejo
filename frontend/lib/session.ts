import 'server-only'

import { EncryptJWT, jwtDecrypt } from 'jose'


const fallbackSecret = 'development-session-secret-change-in-production'

export interface SessionPayload {
  userId: string
  email: string
  rol: 'alumno' | 'administrador'
  nombres: string
  apellidos: string
  accessToken: string
  exp?: number
}

const getSecret = (): string => {
  const secret = process.env.SESSION_SECRET || fallbackSecret
  if (process.env.NODE_ENV === 'production' && (secret === fallbackSecret || secret.length < 32)) {
    throw new Error('SESSION_SECRET debe tener al menos 32 caracteres seguros en producción')
  }
  return secret
}

const getEncryptionKey = async (): Promise<Uint8Array> => {
  const bytes = new TextEncoder().encode(getSecret())
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return new Uint8Array(digest)
}

export const encrypt = async (payload: SessionPayload, expiresAt: number): Promise<string> => {
  return new EncryptJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .encrypt(await getEncryptionKey())
}

export const decrypt = async (session = ''): Promise<SessionPayload | null> => {
  try {
    if (!session) return null
    const { payload } = await jwtDecrypt(session, await getEncryptionKey(), {
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
