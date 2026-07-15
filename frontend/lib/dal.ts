import 'server-only'

import { cookies } from 'next/headers'

import { decrypt, type SessionPayload } from './session'


export const verifySession = async (): Promise<SessionPayload | null> => {
  const session = (await cookies()).get('session')?.value
  return session ? decrypt(session) : null
}

export const requireAuth = async (): Promise<SessionPayload> => {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export const requireRole = async (roles: SessionPayload['rol'][]): Promise<SessionPayload> => {
  const session = await requireAuth()
  if (!roles.includes(session.rol)) throw new Error('Forbidden')
  return session
}
