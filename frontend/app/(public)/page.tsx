import { Car, Clock, Users, Award, Star, Shield, Phone, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="text-sm">
            <Star className="size-3.5 mr-1" />
            Mas de 5000 alumnos graduados
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Aprende a Manejar con los Mejores
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Cursos personalizados para principiantes y avanzados. Instructores
            certificados con anos de experiencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" asChild>
              <a href="#contacto">Reserva tu Clase</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#cursos">Ver Cursos</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: Shield,
      title: "Instructor Certificado",
      description: "Todos nuestros instructores estan certificados y tienen anos de experiencia.",
    },
    {
      icon: Clock,
      title: "Horarios Flexibles",
      description: "Clases disponibles de Lunes a Sabado, en horarios que se adapten a ti.",
    },
    {
      icon: Users,
      title: "Clases Personalizadas",
      description: "Metodologia adaptada a tu ritmo de aprendizaje.",
    },
    {
      icon: Award,
      title: "Certificacion Valida",
      description: "Obten tu licencia con nostros. Certificacion oficialmente reconocida.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader>
                <feature.icon className="size-10 mb-2 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Courses() {
  const courses = [
    {
      title: "Curso Basico",
      description: "Para principiantes que nunca han manejado.",
      duration: "20 horas",
      price: "$299",
      features: ["Fundamentos de conduccion", "Control del vehiculo", "Maniobras basicas", "Estacionamiento"],
    },
    {
      title: "Curso Intermedio",
      description: "Para quienes tienen experiencia basica.",
      duration: "30 horas",
      price: "$449",
      features: ["Conduccion urbana", "Cambios de carril", "Rotondas y intersecciones", "Conduccion nocturna"],
      popular: true,
    },
    {
      title: "Curso Avanzado",
      description: "Para conductores con licencia que quieren mejorar.",
      duration: "15 horas",
      price: "$349",
      features: ["Conduccion defensiva", "Tecnicas de emergencia", "Conduccion en clima adverso", "Revision de vehiculo"],
    },
  ]

  return (
    <section id="cursos" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Cursos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elige el curso que mejor se adapte a tus necesidades y comienza tu
            camino hacia la conduccion segura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className={course.popular ? "relative border-primary shadow-lg" : ""}>
              {course.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Mas Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{course.price}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="size-4" />
                  <span>{course.duration}</span>
                </div>
                <ul className="space-y-2">
                  {course.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={course.popular ? "default" : "outline"}>
                  Inscribirse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const pricingPlans = [
    {
      title: "Clase Individual",
      price: "$25",
      description: "Por hora de clase",
      features: ["1 hora de instruccion", "Vehiculo incluido", "Instructor certificado"],
    },
    {
      title: "Paquete 10 Clases",
      price: "$220",
      description: "Ahorra $30",
      features: ["10 horas de instruccion", "Vehiculo incluido", "Instructor certificado", "Material de apoyo"],
      popular: true,
    },
    {
      title: "Paquete 20 Clases",
      price: "$400",
      description: "Ahorra $100",
      features: ["20 horas de instruccion", "Vehiculo incluido", "Instructor dedicado", "Material de apoyo", "Simulador de examen"],
    },
  ]

  return (
    <section id="precios" className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Precios Transparentes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sin costos ocultos. El precio que ves es el precio que pagas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={plan.popular ? "relative border-primary" : ""}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Recomendado</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Elegir Plan
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
  return (
    <section id="nosotros" className="py-16 md:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sobre Nosotros</h2>
            <p className="text-muted-foreground mb-4">
              Con mas de 15 anos de experiencia en la ensenanza de conduccion,
              Academia de Manejo ha ayudado a miles de personas a obtener su
              licencia y convertirse en conductores seguros.
            </p>
            <p className="text-muted-foreground mb-6">
              Nuestro equipo de instructores certificados se compromete a ofrecer
              la mejor experiencia de aprendizaje, con vehiculos modernos y
              tecnicas pedagógicas adaptadas a cada estudiante.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Alumnos graduados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Anos de experiencia</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Tasa de aprobacion</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <Car className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Vehiculos Modernos</h3>
              <p className="text-sm text-muted-foreground">
                Flota de vehiculos nuevos y equipados con doble comando.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Instructores Expertos</h3>
              <p className="text-sm text-muted-foreground">
                Profesionales certificados con metodologia comprovada.
              </p>
            </Card>
            <Card className="p-6">
              <Award className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Certificacion Valida</h3>
              <p className="text-sm text-muted-foreground">
                Certificacion reconocida por las autoridades de transito.
              </p>
            </Card>
            <Card className="p-6">
              <Star className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Excelente Reputacion</h3>
              <p className="text-sm text-muted-foreground">
                Valoraciones de 4.9/5 en Google y redes sociales.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contactanos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas? ¿Quieres agendar una clase? Escribenos y nos
            pondremos en contacto contigo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Envianos un mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y te responderemos lo antes posible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre
                    </label>
                    <Input id="name" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Telefono
                    </label>
                    <Input id="phone" type="tel" placeholder="+1 234 567 890" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="¿En que podemos ayudarte?"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Phone className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Telefono</h3>
                    <p className="text-muted-foreground">+1 234 567 890</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lunes - Viernes: 8:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Mail className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@academiamanejo.com</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Respondemos en menos de 24 horas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Ubicacion</h3>
                    <p className="text-muted-foreground">Av. Principal 123, Ciudad</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cerca del centro comercial principal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Courses />
      <Pricing />
      <About />
      <Contact />
    </>
  )
}
