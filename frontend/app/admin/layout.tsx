import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Car, LogOut } from "lucide-react"

import { verifySession } from "@/lib/dal"
import { logout } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { AdminNav } from "./_components/admin-nav"
import { HeaderNavLink } from "./_components/header-nav"

export const metadata: Metadata = {
  title: "Administración",
  description: "Panel privado de gestión de la academia.",
  robots: { index: false, follow: false },
}

const AdminLayout = async ({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactNode> => {
  const session = await verifySession()

  if (!session || session.rol !== "administrador") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50">
      <AdminNav session={session} />

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4 md:hidden">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Car className="size-4 text-primary-foreground" />
                </div>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:gap-6">
              <HeaderNavLink href="/admin/alumnos" label="Alumnos" />
              <HeaderNavLink href="/admin/reservas" label="Reservas" />
              <HeaderNavLink href="/admin/servicios" label="Servicios" />
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{session.nombres} {session.apellidos}</p>
                  <p className="text-xs text-muted-foreground capitalize">{session.rol}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-md">
                  {session.nombres.charAt(0)}{session.apellidos.charAt(0)}
                </div>
              </div>
              <form action={logout} className="ml-2">
                <Button variant="ghost" size="sm" type="submit" className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
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
