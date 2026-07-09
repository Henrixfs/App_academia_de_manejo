import * as React from "react"
import Link from "next/link"
import { Car, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Car className="size-6" />
              <span>Academia de Manejo</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Aprende a manejar con los mejores instructores. Clases
              personalizadas para todas las edades.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Enlaces</h3>
            <Link href="#cursos" className="text-sm text-muted-foreground hover:text-primary">
              Cursos
            </Link>
            <Link href="#precios" className="text-sm text-muted-foreground hover:text-primary">
              Precios
            </Link>
            <Link href="#nosotros" className="text-sm text-muted-foreground hover:text-primary">
              Nosotros
            </Link>
            <Link href="#contacto" className="text-sm text-muted-foreground hover:text-primary">
              Contacto
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Contacto</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span>Av. Principal 123, Ciudad</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              <span>info@academiamanejo.com</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Horario</h3>
            <p className="text-sm text-muted-foreground">
              Lunes - Viernes: 8:00 AM - 6:00 PM
            </p>
            <p className="text-sm text-muted-foreground">
              Sabados: 9:00 AM - 2:00 PM
            </p>
            <p className="text-sm text-muted-foreground">
              Domingos: Cerrado
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            2026 Academia de Manejo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
