import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/providers/theme-toogle'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Acceso seguro para alumnos y administradores.',
  robots: { index: false, follow: false },
}

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps): React.ReactNode => (
  <div className="auth-canvas flex min-h-screen flex-col">
    <header className="site-header relative z-10 border-b backdrop-blur-xl">
      <div className="container flex h-[4.5rem] items-center justify-between">
        <Link href="/" className="brand-lockup flex items-center gap-3 font-semibold">
          <Image src="/logo.png" alt="Logo Academia de Manejo San Cristóbal VIP" width={40} height={40} className="brand-crest size-10 rounded-xl object-contain" priority />
          <span className="text-sm sm:text-base">Academia de Manejo</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="gap-2 rounded-full">
            <Link href="/"><ArrowLeft className="size-4" />Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </header>

    <main className="grid flex-1 lg:grid-cols-[1.03fr_0.97fr]">
      <section className="auth-brand-panel relative hidden min-h-[calc(100vh-4.5rem)] overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 flex size-20 items-center justify-center rounded-3xl border border-amber-200/20 bg-white/10 p-3 shadow-2xl">
            <Image src="/logo.png" alt="Escudo San Cristóbal VIP" width={64} height={64} className="size-16 rounded-2xl object-contain" />
          </div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-100">
            <ShieldCheck className="size-3.5" /> ACCESO PROTEGIDO
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight">Tu camino seguro comienza con una decisión.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">Gestiona tus clases, reservas y progreso en una experiencia diseñada para acompañarte al volante.</p>
        </div>
        <div className="relative z-10 grid gap-3 text-sm text-slate-200">
          <p className="flex items-center gap-3"><CheckCircle2 className="size-4 text-amber-300" /> Información protegida y acceso por rol.</p>
          <p className="flex items-center gap-3"><CheckCircle2 className="size-4 text-amber-300" /> Formación práctica con enfoque en seguridad vial.</p>
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        {children}
      </section>
    </main>
  </div>
)

export default AuthLayout
