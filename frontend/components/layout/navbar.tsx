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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/logo.png"
            alt="Logo Academia de Manejo San Cristóbal VIP"
            width={32}
            height={32}
            className="size-8"
            priority
          />
          <span>Academia de Manejo San Cristóbal VIP</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="#servicios" className="text-sm font-medium hover:text-primary">
            Servicios
          </Link>
          <Link href="#nosotros" className="text-sm font-medium hover:text-primary">
            Nosotros
          </Link>
          <Link href="#preguntas" className="text-sm font-medium hover:text-primary">
            Preguntas
          </Link>
          <Link href="#contacto" className="text-sm font-medium hover:text-primary">
            Contacto
          </Link>
          <Button asChild size="sm">
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
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="#nosotros"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="#preguntas"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Preguntas
            </Link>
            <Link
              href="#contacto"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            <Button asChild size="sm">
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
