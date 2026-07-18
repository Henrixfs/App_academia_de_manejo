"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Calendar, ChevronRight, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react"

interface AdminNavProps {
  session: { nombres: string; apellidos: string; rol: string }
}

export const AdminNav = ({ session }: AdminNavProps): React.ReactNode => {
  const pathname = usePathname()
  const initials = `${session.nombres.charAt(0)}${session.apellidos.charAt(0)}`.toUpperCase()

  return (
    <aside className="admin-sidebar fixed z-50 hidden h-full w-64 flex-col border-r md:flex">
      <div className="flex h-[4.5rem] items-center border-b border-white/10 px-5">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Academia de Manejo San Cristóbal VIP" width={40} height={40} className="brand-crest size-10 rounded-xl object-contain" />
          <div><span className="font-heading text-base font-semibold text-white">San Cristóbal VIP</span><span className="mt-0.5 block text-[10px] font-semibold tracking-[0.18em] text-amber-200/80">PANEL ADMIN</span></div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1.5 p-4" aria-label="Administración">
        <NavLink href="/admin" icon={LayoutDashboard} label="Resumen" pathname={pathname} />
        <NavLink href="/admin/alumnos" icon={Users} label="Alumnos" pathname={pathname} />
        <NavLink href="/admin/reservas" icon={Calendar} label="Reservas" pathname={pathname} />
        <NavLink href="/admin/servicios" icon={Settings} label="Servicios" pathname={pathname} />
      </nav>
      <div className="m-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-amber-200 text-sm font-bold text-slate-950">{initials}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{session.nombres}</p><p className="text-xs capitalize text-slate-400">{session.rol}</p></div></div>
      </div>
    </aside>
  )
}

interface NavLinkProps { href: string; icon: LucideIcon; label: string; pathname: string }

const NavLink = ({ href, icon: Icon, label, pathname }: NavLinkProps): React.ReactNode => {
  const isActive = pathname === href
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? "sidebar-link-active" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}>
      <Icon className={`size-5 ${isActive ? "text-amber-200" : ""}`} />{label}{isActive && <ChevronRight className="ml-auto size-4 text-amber-200/70" />}
    </Link>
  )
}
