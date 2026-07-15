import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { decrypt } from './lib/session'


export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const path = request.nextUrl.pathname
  const sessionCookie = request.cookies.get('session')?.value
  const session = sessionCookie ? await decrypt(sessionCookie) : null

  if (path.startsWith('/admin') && (!session || session.rol !== 'administrador')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  if (path.startsWith('/cuenta') && (!session || session.rol !== 'alumno')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
