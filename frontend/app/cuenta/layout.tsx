import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { logout } from '@/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { verifySession } from '@/lib/dal'


interface CuentaLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Perfil y reservas del alumno.',
  robots: { index: false, follow: false },
}

const CuentaLayout = async ({ children }: CuentaLayoutProps): Promise<React.ReactNode> => {
  const session = await verifySession()
  if (!session || session.rol !== 'alumno') redirect('/login')
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/cuenta" className="font-semibold">San Cristóbal VIP</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.nombres} {session.apellidos}</span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">Cerrar sesión</Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  )
}

export default CuentaLayout
