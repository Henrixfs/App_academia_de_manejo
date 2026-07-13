"use client"

import * as React from "react"
import Link from "next/link"
import { Car, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/providers/theme-toogle"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="size-6" />
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
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t md:hidden">
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
          </div>
        </div>
      )}
    </header>
  )
}
