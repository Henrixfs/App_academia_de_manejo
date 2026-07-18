"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function HeaderNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "bg-primary text-primary-foreground shadow-admin-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  )
}
