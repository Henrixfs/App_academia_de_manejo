import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="site-footer border-t border-white/10">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="brand-lockup flex items-center gap-3 font-semibold text-white">
              <Image
                src="/logo.png"
                alt="Logo Academia de Manejo San Cristóbal VIP"
                width={40}
                height={40}
                className="brand-crest size-10 rounded-xl object-contain"
              />
              <span>Academia de Manejo San Cristóbal VIP</span>
            </Link>
            <p className="text-sm text-slate-300">
              Centro de entrenamiento especializado en formación de conductores seguros y capacitados en Ayacucho.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">Servicios</h3>
            <Link href="#servicios" className="text-sm text-slate-300 transition-colors hover:text-amber-200">Simulacro Tipo Examen</Link>
            <Link href="#servicios" className="text-sm text-slate-300 transition-colors hover:text-amber-200">Circuito Libre</Link>
            <Link href="#servicios" className="text-sm text-slate-300 transition-colors hover:text-amber-200">Paquete San Cristóbal</Link>
            <Link href="#servicios" className="text-sm text-slate-300 transition-colors hover:text-amber-200">Asesoría en Trámites</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">Enlaces</h3>
            <Link href="#nosotros" className="text-sm text-slate-300 transition-colors hover:text-amber-200">Sobre Nosotros</Link>
            <Link href="#preguntas" className="text-sm text-slate-300 transition-colors hover:text-amber-200">Preguntas Frecuentes</Link>
            <Link href="#contacto" className="text-sm text-slate-300 transition-colors hover:text-amber-200">Contacto</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">Contacto</h3>
            <div className="flex items-center gap-2 text-sm text-slate-300"><MapPin className="size-4 text-amber-300" /><span>Jr. Los Morochucos N° 349, Ayacucho</span></div>
            <div className="flex items-center gap-2 text-sm text-slate-300"><Phone className="size-4 text-amber-300" /><span>WhatsApp (canal principal)</span></div>
            <div className="flex items-center gap-2 text-sm text-slate-300"><Mail className="size-4 text-amber-300" /><span>Facebook</span></div>
            <p className="mt-2 text-xs text-slate-400">Referencia: A unas cuadras del Arco Magisterial</p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-slate-300">Academia de Manejo San Cristóbal VIP · Jr. Los Morochucos N° 349, Ayacucho, Perú</p>
          <p className="mt-2 text-sm text-slate-400">2026 Academia de Manejo San Cristóbal VIP. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
