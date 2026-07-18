import Image from "next/image"
import { Award, Car, CheckCircle2, Clock, FileText, GraduationCap, HelpCircle, MapPin, Phone, ShieldCheck, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ContactForm } from "@/components/contact-form"

const values = [
  { icon: ShieldCheck, title: "Seguridad", description: "La integridad del alumno e instructor es prioritaria en toda sesión." },
  { icon: Users, title: "Paciencia Pedagógica", description: "El ritmo de enseñanza se adapta al nivel de cada alumno." },
  { icon: Award, title: "Excelencia", description: "Preparación integral para afrontar cada evaluación con confianza." },
  { icon: CheckCircle2, title: "Responsabilidad Vial", description: "Respeto a las normas de tránsito desde la primera clase." },
  { icon: FileText, title: "Transparencia", description: "Comunicación clara sobre procesos, trámites y requisitos." },
]

const services = [
  {
    icon: FileText,
    title: "Simulacro Tipo Examen",
    price: "S/ 40.00",
    duration: "1 hora",
    description: "Evaluación práctica con los mismos criterios del centro oficial de emisión de licencias.",
    features: ["Clasifica faltas leves, graves y eliminatorias", "Retroalimentación escrita al finalizar", "Observaciones y puntos de mejora"],
  },
  {
    icon: Car,
    title: "Circuito Libre",
    price: "S/ 40.00",
    duration: "1 hora mínimo",
    description: "Alquiler de pista para práctica de maniobras específicas.",
    features: ["Estacionamiento en paralelo", "Marcha atrás", "Curvas cerradas", "Reserva previa obligatoria"],
    popular: true,
  },
  {
    icon: GraduationCap,
    title: "Paquete San Cristóbal",
    price: "Consultar",
    duration: "Paquete completo",
    description: "Programa completo desde nivel básico hasta nivel intermedio con acompañamiento constante.",
    features: ["Evaluación diagnóstica inicial", "Sesiones progresivas por niveles", "Simulacro de cierre", "Asesoría en trámites incluida"],
  },
]

const faqs = [
  ["¿Necesito experiencia previa para inscribirme?", "No. El Paquete San Cristóbal está diseñado para iniciar desde nivel cero. La metodología es progresiva y el instructor adapta el ritmo al nivel real del alumno."],
  ["¿Los vehículos cuentan con doble comando?", "Sí. Todos los vehículos de la flota disponen de doble mando, lo que garantiza la intervención inmediata del instructor ante cualquier situación de riesgo."],
  ["¿Cuánto cuesta la práctica en el circuito?", "La tarifa es de S/ 40.00 por hora, aplicable al Circuito Libre y al Simulacro Tipo Examen. El Paquete San Cristóbal tiene tarifa diferenciada; consultar al momento de la inscripción."],
  ["¿Cuál es el horario de atención?", "La academia atiende de lunes a viernes de 8:00 a.m. a 6:00 p.m. Las consultas fuera de ese horario serán respondidas el siguiente día hábil."],
  ["¿Qué pasa si no apruebo el examen oficial?", "Los alumnos del Paquete San Cristóbal tienen derecho a sesiones de refuerzo y un nuevo simulacro sin costo adicional hasta lograr la aprobación."],
  ["¿Puedo alquilar el circuito sin inscribirme en un paquete?", "Sí, mediante el servicio Circuito Libre a S/ 40.00 por hora. Se requiere reserva previa con mínimo de 1 hora dentro del horario de atención."],
  ["¿La academia ayuda con los trámites de la licencia?", "Sí. El servicio de Asesoría en Trámites guía al alumno paso a paso en la programación de su cita y el cumplimiento de los requisitos documentarios ante la autoridad competente."],
  ["¿Cómo llego a la academia?", "Dirección: Jr. Los Morochucos N° 349, Ayacucho, a unas cuadras del Arco Magisterial. Puedes llegar tomando la Ruta 7 o la Ruta 12 del transporte público."],
]

function Hero() {
  return (
    <section className="hero-road text-white">
      <div className="container hero-road-grid grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-6 border border-amber-200/20 bg-amber-100/10 px-3 py-1.5 text-amber-100 hover:bg-amber-100/10">
            <Star className="mr-1 size-3.5 fill-current" /> Más de 5000 alumnos graduados
          </Badge>
          <p className="mb-4 text-sm font-semibold tracking-[0.16em] text-amber-200">FORMACIÓN VIAL PREMIUM EN AYACUCHO</p>
          <h1 className="font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">Academia de Manejo San Cristóbal VIP</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Centro de entrenamiento especializado en formación de conductores seguros y capacitados. Aprende con claridad, paciencia y una ruta diseñada para tu confianza.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="button-gold rounded-full px-6" asChild>
              <a href="https://wa.me/51992684562" target="_blank" rel="noopener noreferrer">Reservar por WhatsApp</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white" asChild>
              <a href="#servicios">Ver servicios</a>
            </Button>
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-slate-300"><MapPin className="size-4 text-amber-300" /> Jr. Los Morochucos N° 349, Ayacucho · A unas cuadras del Arco Magisterial</p>
        </div>

        <div className="hero-crest-panel relative mx-auto w-full max-w-md rounded-[2rem] p-6 sm:p-8">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 shadow-2xl">
              <Image src="/logo.png" alt="Escudo de San Cristóbal VIP" width={190} height={190} className="size-40 rounded-3xl object-contain sm:size-48" priority />
            </div>
            <p className="mt-6 text-sm font-semibold tracking-[0.15em] text-amber-200">CONDUCE CON CONFIANZA</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">Una experiencia de aprendizaje segura, ordenada y acompañada desde tu primera práctica.</p>
            <div className="mt-7 grid w-full grid-cols-3 gap-2">
              <div className="hero-stat rounded-2xl p-3"><ShieldCheck className="mx-auto size-5 text-amber-300" /><p className="mt-2 text-[11px] text-slate-300">Seguridad</p></div>
              <div className="hero-stat rounded-2xl p-3"><Car className="mx-auto size-5 text-amber-300" /><p className="mt-2 text-[11px] text-slate-300">Práctica</p></div>
              <div className="hero-stat rounded-2xl p-3"><GraduationCap className="mx-auto size-5 text-amber-300" /><p className="mt-2 text-[11px] text-slate-300">Progreso</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Values() {
  return (
    <section className="landing-soft-section py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.15em] text-secondary">NUESTRA PROMESA</p>
          <h2 className="landing-section-title mt-3 text-3xl font-semibold sm:text-4xl">Aprender a conducir también es aprender a confiar.</h2>
          <p className="mt-4 text-muted-foreground">Nuestros valores guían cada sesión de enseñanza y cada decisión en el circuito.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((value) => (
            <Card key={value.title} className="premium-card card-hover-effect py-0">
              <CardContent className="p-6 text-center">
                <div className="icon-circle icon-circle-primary mx-auto mb-4"><value.icon className="size-5" /></div>
                <h3 className="font-heading font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="servicios" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.15em] text-secondary">RUTAS DE APRENDIZAJE</p>
          <h2 className="landing-section-title mt-3 text-3xl font-semibold sm:text-4xl">Elige la práctica que te acerca a tu meta.</h2>
          <p className="mt-4 text-muted-foreground">Servicios claros, acompañamiento profesional y un circuito pensado para avanzar con seguridad.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className={`premium-card card-hover-effect relative ${service.popular ? "service-card-popular" : ""}`}>
              {service.popular && <Badge className="absolute right-6 top-5 bg-primary text-primary-foreground">Más popular</Badge>}
              <CardHeader>
                <div className="icon-circle icon-circle-accent mb-3"><service.icon className="size-5" /></div>
                <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                <CardDescription className="leading-6">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6 flex items-end gap-2"><span className="font-heading text-3xl font-semibold text-primary">{service.price}</span><span className="pb-1 text-sm text-muted-foreground">/ {service.duration}</span></div>
                <ul className="space-y-3">
                  {service.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />{feature}</li>)}
                </ul>
              </CardContent>
              <CardFooter className="border-t border-border/70 bg-transparent">
                <Button className={service.popular ? "button-gold w-full" : "w-full"} variant={service.popular ? "default" : "outline"} asChild>
                  <a href={`https://wa.me/51992684562?text=${encodeURIComponent(`Hola, deseo información sobre ${service.title}.`)}`} target="_blank" rel="noopener noreferrer">Solicitar información</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  const features = [
    [ShieldCheck, "Vehículos con Doble Comando", "Todos los vehículos disponen de doble mando para intervención inmediata del instructor."],
    [MapPin, "Circuito Homologado", "Pista de manejo diseñada bajo los estándares y dimensiones del examen oficial."],
    [Users, "Instructores Expertos", "Profesionales certificados con metodología comprobada y paciente."],
    [Award, "Alta Tasa de Aprobación", "Preparación integral para llegar al examen con más seguridad."],
  ]

  return (
    <section id="nosotros" className="landing-soft-section py-16 md:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.15em] text-secondary">SOBRE NOSOTROS</p>
          <h2 className="landing-section-title mt-3 text-3xl font-semibold sm:text-4xl">Formamos conductores responsables para las rutas de Ayacucho.</h2>
          <div className="mt-8 space-y-6">
            <div className="border-l-2 border-secondary pl-5"><h3 className="font-heading text-lg font-semibold">Misión</h3><p className="mt-2 leading-7 text-muted-foreground">Formar conductores competentes y responsables mediante práctica intensiva en circuito homologado bajo estándares oficiales.</p></div>
            <div className="border-l-2 border-accent pl-5"><h3 className="font-heading text-lg font-semibold">Visión</h3><p className="mt-2 leading-7 text-muted-foreground">Consolidarnos como la academia de manejo más recomendada de Ayacucho, siendo referente regional en seguridad vial y atención al cliente.</p></div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(([Icon, title, description]) => (
            <Card key={title as string} className="premium-card card-hover-effect py-0"><CardContent className="p-6"><div className="icon-circle icon-circle-accent mb-4"><Icon className="size-5" /></div><h3 className="font-heading font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description as string}</p></CardContent></Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQs() {
  return (
    <section id="preguntas" className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <div className="mx-auto mb-12 max-w-2xl text-center"><p className="text-sm font-semibold tracking-[0.15em] text-secondary">TE ACOMPAÑAMOS</p><h2 className="landing-section-title mt-3 text-3xl font-semibold sm:text-4xl">Preguntas frecuentes</h2><p className="mt-4 text-muted-foreground">Respuestas claras para que puedas empezar con tranquilidad.</p></div>
        <Accordion type="single" collapsible className="premium-card overflow-hidden rounded-2xl px-6">
          {faqs.map(([question, answer], index) => <AccordionItem key={question} value={`item-${index}`} className="border-border/70"><AccordionTrigger className="text-left font-heading text-base font-semibold hover:no-underline">{question}</AccordionTrigger><AccordionContent className="max-w-3xl pb-5 leading-7 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </div>
    </section>
  )
}

function Contact() {
  const details = [
    [MapPin, "Ubicación", "Jr. Los Morochucos N° 349, Ayacucho", "A unas cuadras del Arco Magisterial"],
    [Clock, "Horario de Atención", "Lunes a Viernes: 8:00 a.m. – 6:00 p.m.", "Sábados: Cerrado · Domingos: Cerrado"],
    [HelpCircle, "Transporte Público", "Ruta 7 (deja a pasos del circuito)", "Ruta 12 (acceso directo)"],
  ]

  return (
    <section id="contacto" className="landing-soft-section py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center"><p className="text-sm font-semibold tracking-[0.15em] text-secondary">CONTÁCTANOS</p><h2 className="landing-section-title mt-3 text-3xl font-semibold sm:text-4xl">Empecemos tu camino hoy.</h2><p className="mt-4 text-muted-foreground">Cuéntanos qué necesitas y te ayudaremos a encontrar la práctica adecuada.</p></div>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="premium-card"><CardHeader><CardTitle className="text-xl font-semibold">Envíanos un mensaje</CardTitle><CardDescription>Completa el formulario y te responderemos lo antes posible.</CardDescription></CardHeader><CardContent><ContactForm /></CardContent></Card>
          <div className="space-y-4">
            {details.map(([Icon, title, lineOne, lineTwo]) => <Card key={title as string} className="premium-card py-0"><CardContent className="flex gap-4 p-5"><div className="icon-circle icon-circle-accent shrink-0"><Icon className="size-5" /></div><div><h3 className="font-heading font-semibold">{title as string}</h3><p className="mt-1 text-sm text-muted-foreground">{lineOne as string}</p><p className="mt-1 text-sm text-muted-foreground">{lineTwo as string}</p></div></CardContent></Card>)}
            <Card className="border border-emerald-700/20 bg-emerald-700 text-white shadow-lg"><CardContent className="flex items-start gap-4 p-5"><Phone className="mt-1 size-5" /><div><h3 className="font-heading font-semibold">WhatsApp</h3><p className="mt-1 text-sm text-emerald-50">Canal principal de reservas y consultas.</p><Button className="mt-4 border border-white/20 bg-white text-emerald-800 hover:bg-emerald-50" asChild><a href="https://wa.me/51992684562" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></Button></div></CardContent></Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return <><Hero /><Values /><Services /><About /><FAQs /><Contact /></>
}
