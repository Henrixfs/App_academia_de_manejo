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
              <span>Academia de Manejo San Cristóbal VIP</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Centro de entrenamiento especializado en formación de conductores seguros y capacitados en Ayacucho.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Servicios</h3>
            <Link href="#servicios" className="text-sm text-muted-foreground hover:text-primary">
              Simulacro Tipo Examen
            </Link>
            <Link href="#servicios" className="text-sm text-muted-foreground hover:text-primary">
              Circuito Libre
            </Link>
            <Link href="#servicios" className="text-sm text-muted-foreground hover:text-primary">
              Paquete San Cristóbal
            </Link>
            <Link href="#servicios" className="text-sm text-muted-foreground hover:text-primary">
              Asesoría en Trámites
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Enlaces</h3>
            <Link href="#nosotros" className="text-sm text-muted-foreground hover:text-primary">
              Sobre Nosotros
            </Link>
            <Link href="#preguntas" className="text-sm text-muted-foreground hover:text-primary">
              Preguntas Frecuentes
            </Link>
            <Link href="#contacto" className="text-sm text-muted-foreground hover:text-primary">
              Contacto
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Contacto</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span>Jr. Los Morochucos N° 349, Ayacucho</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              <span>WhatsApp (canal principal)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              <span>Facebook</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <span className="text-xs text-muted-foreground">Referencia: A unas cuadras del Arco Magisterial</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Academia de Manejo San Cristóbal VIP · Jr. Los Morochucos N° 349, Ayacucho, Perú
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            2026 Academia de Manejo San Cristóbal VIP. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
