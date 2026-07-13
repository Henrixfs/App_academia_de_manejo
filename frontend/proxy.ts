import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from './lib/session'

const protectedRoutes = ['/admin']
const authRoutes = ['/login']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/favicon')) {
    return NextResponse.next()
  }

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAuthRoute = authRoutes.includes(path)

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  
  const session = sessionCookie ? await decrypt(sessionCookie) : null

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  if (path === '/' && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
