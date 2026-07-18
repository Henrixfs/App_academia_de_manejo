"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/providers/theme-toogle"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="site-header sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <nav className="container flex h-[4.5rem] items-center justify-between">
        <Link href="/" className="brand-lockup flex items-center gap-3 font-semibold">
          <Image
            src="/logo.png"
            alt="Logo Academia de Manejo San Cristóbal VIP"
            width={40}
            height={40}
            className="brand-crest size-10 rounded-xl object-contain"
            priority
          />
          <span className="max-w-48 text-sm leading-tight sm:max-w-none sm:text-base">Academia de Manejo San Cristóbal VIP</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="#servicios" className="site-nav-link text-sm font-medium">
            Servicios
          </Link>
          <Link href="#nosotros" className="site-nav-link text-sm font-medium">
            Nosotros
          </Link>
          <Link href="#preguntas" className="site-nav-link text-sm font-medium">
            Preguntas
          </Link>
          <Link href="#contacto" className="site-nav-link text-sm font-medium">
            Contacto
          </Link>
          <Button asChild size="sm" className="rounded-full px-4">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div id="mobile-navigation" className="border-t md:hidden">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              href="#servicios"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="#nosotros"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="#preguntas"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Preguntas
            </Link>
            <Link
              href="#contacto"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Iniciar sesión
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
