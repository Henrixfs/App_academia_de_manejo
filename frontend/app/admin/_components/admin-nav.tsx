"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Users, Calendar, Settings, LayoutDashboard, ChevronRight } from "lucide-react"

interface AdminNavProps {
  session: {
    nombres: string
    apellidos: string
    rol: string
  }
}

export function AdminNav({ session }: AdminNavProps) {
  const pathname = usePathname()

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
  }

  return (
    <aside className="w-64 bg-card border-r border-border/40 hidden md:flex flex-col fixed h-full z-40 shadow-sm">
      <div className="h-16 flex items-center border-b border-border/40 px-6 bg-gradient-to-r from-card to-muted/20">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Car className="size-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-card-foreground">Academia</span>
            <span className="block text-[10px] text-muted-foreground -mt-1 uppercase tracking-widest">Panel Admin</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1.5">
        <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" pathname={pathname} />
        <NavLink href="/admin/alumnos" icon={Users} label="Alumnos" pathname={pathname} />
        <NavLink href="/admin/reservas" icon={Calendar} label="Reservas" pathname={pathname} />
        <NavLink href="/admin/servicios" icon={Settings} label="Servicios" pathname={pathname} />
      </nav>
      <div className="p-4 border-t border-border/40">
        <div className="bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-md">
              {getInitials(session.nombres, session.apellidos)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-card-foreground">{session.nombres}</p>
              <p className="text-xs text-muted-foreground capitalize">{session.rol}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavLink({ href, icon: Icon, label, pathname }: { href: string; icon: any; label: string; pathname: string }) {
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-primary/10 text-primary border-l-[3px] border-primary font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className={`size-5 ${isActive ? "text-primary" : ""}`} />
      {label}
      {isActive && (
        <ChevronRight className="size-4 ml-auto text-primary/60" />
      )}
    </Link>
  )
}