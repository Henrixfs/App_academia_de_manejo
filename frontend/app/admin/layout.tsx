import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LogOut } from "lucide-react"

import { verifySession } from "@/lib/dal"
import { logout } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/providers/theme-toogle"
import { AdminNav } from "./_components/admin-nav"
import { HeaderNavLink } from "./_components/header-nav"

export const metadata: Metadata = {
  title: "Administración",
  description: "Panel privado de gestión de la academia.",
  robots: { index: false, follow: false },
}

const AdminLayout = async ({ children }: { children: React.ReactNode }): Promise<React.ReactNode> => {
  const session = await verifySession()

  if (!session || session.rol !== "administrador") {
    redirect("/login")
  }

  return (
    <div className="admin-shell flex">
      <AdminNav session={session} />
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="admin-topbar sticky top-0 z-40 w-full border-b backdrop-blur-xl">
          <div className="container flex h-[4.5rem] items-center justify-between">
            <div className="flex items-center gap-4 md:hidden">
              <Link href="/admin" className="flex items-center gap-2" aria-label="Ir al panel principal">
                <Image src="/logo.png" alt="Logo Academia de Manejo San Cristóbal VIP" width={36} height={36} className="brand-crest size-9 rounded-lg object-contain" />
              </Link>
            </div>

            <nav className="hidden items-center gap-2 md:flex" aria-label="Navegación rápida de administración">
              <HeaderNavLink href="/admin/alumnos" label="Alumnos" />
              <HeaderNavLink href="/admin/reservas" label="Reservas" />
              <HeaderNavLink href="/admin/servicios" label="Servicios" />
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right"><p className="text-sm font-semibold">{session.nombres} {session.apellidos}</p><p className="text-xs capitalize text-muted-foreground">{session.rol}</p></div>
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-admin-primary">{session.nombres.charAt(0)}{session.apellidos.charAt(0)}</div>
              </div>
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="gap-2 rounded-full hover:bg-destructive/10 hover:text-destructive"><LogOut className="size-4" /><span className="hidden sm:inline">Salir</span></Button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
