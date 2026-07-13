import { Shield, Clock, Award, Users, Star, MapPin, Phone, CheckCircle, FileText, Car, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="text-sm">
            <Star className="size-3.5 mr-1" />
            Más de 5000 alumnos graduados
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Academia de Manejo San Cristóbal VIP
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Centro de entrenamiento especializado en formación de conductores seguros y capacitados en Ayacucho.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
<Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <a href="https://wa.me/51992684562" target="_blank" rel="noopener noreferrer">
                <svg className="size-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.203 5.076 4.642.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.189 6.93 3.207l.394-1.089a12.11 12.11 0 002.68-7.161l-.001-.001a12.11 12.11 0 00-2.68 7.161l.394 1.089c.51-.514 1.15-.983 1.85-1.384a9.87 9.87 0 011.511-5.26 9.87 9.87 0 00-1.511 5.26v.001c.015.28.022.565.022.849 0 2.333-.526 4.415-1.338 6.08-.148.302-.311.596-.492.88l.013.001.017.002.01.003.003.001.007.007.001.002a9.83 9.83 0 01.492.88 9.84 9.84 0 01-1.338 6.08 9.87 9.87 0 00-1.511 5.26 9.87 9.87 0 001.511-5.26l-.001-.001a9.86 9.86 0 001.51-5.26v.001c.015.28.022.565.022.849 0 2.333-.526 4.415-1.338 6.08-.148.302-.311.596-.492.88l.013.001.017.002.01.003.003.001.007.007.001.002a9.83 9.83 0 01.492.88 9.84 9.84 0 01-1.338 6.08 9.87 9.87 0 00-1.511 5.26 9.87 9.87 0 001.511-5.26l-.001-.001a9.86 9.86 0 001.51-5.26 9.86 9.86 0 00-1.51 5.26l.361.214 3.741-.982-.998 3.648.235.374a9.86 9.86 0 001.51 5.26 9.87 9.87 0 005.032 1.378l.361.214 3.741-.982-.998 3.648.235.374a9.86 9.86 0 001.51 5.26c-.297.149-1.758.867-2.03.967-.273.099-.471.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.203 5.076 4.642.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                Reservar por WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#servicios">Ver Servicios</a>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <MapPin className="size-4" />
            <span>Jr. Los Morochucos N° 349, Ayacucho · A unas cuadras del Arco Magisterial</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
    </section>
  )
}

function Values() {
  const values = [
    {
      icon: Shield,
      title: "Seguridad",
      description: "La integridad del alumno e instructor es prioritaria en toda sesión.",
    },
    {
      icon: Users,
      title: "Paciencia Pedagógica",
      description: "El ritmo de enseñanza se adapta al nivel de cada alumno.",
    },
    {
      icon: Award,
      title: "Excelencia",
      description: "Preparación integral que garantice la aprobación en primer intento.",
    },
    {
      icon: CheckCircle,
      title: "Responsabilidad Vial",
      description: "Respeto a las normas de tránsito desde la primera clase.",
    },
    {
      icon: FileText,
      title: "Transparencia",
      description: "Comunicación clara sobre procesos, trámites y requisitos.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Valores</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            En la Academia de Manejo San Cristóbal VIP, nuestros valores guían cada sesión de enseñanza.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="border-0 shadow-sm text-center">
              <CardHeader>
                <value.icon className="size-10 mb-2 text-primary mx-auto" />
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const services = [
    {
      icon: FileText,
      title: "Simulacro Tipo Examen",
      price: "S/ 40.00",
      duration: "1 hora",
      description: "Evaluación práctica con los mismos criterios del centro oficial de emisión de licencias.",
      features: [
        "Clasifica las infracciones en faltas leves, graves y eliminatorias",
        "Retroalimentación escrita al finalizar",
        "Observaciones y puntos de mejora",
      ],
    },
    {
      icon: Car,
      title: "Circuito Libre",
      price: "S/ 40.00",
      duration: "1 hora mínimo",
      description: "Alquiler de pista para práctica de maniobras específicas.",
      features: [
        "Estacionamiento en paralelo",
        "Marcha atrás",
        "Curvas cerradas",
        "Reserva previa obligatoria",
      ],
      popular: true,
    },
    {
      icon: Award,
      title: "Paquete San Cristóbal",
      price: "Consultar",
      duration: "Paquete completo",
      description: "Programa completo desde nivel básico hasta nivel intermedio con acompañamiento constante.",
      features: [
        "Evaluación diagnóstica inicial",
        "Sesiones progresivas por niveles",
        "Simulacro de cierre",
        "Asesoría en trámites incluida",
      ],
    },
  ]

  return (
    <section id="servicios" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elige el servicio que mejor se adapte a tus necesidades y comienza tu camino hacia la conducción segura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className={service.popular ? "relative border-primary shadow-lg" : ""}>
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Más Popular</Badge>
                </div>
              )}
              <CardHeader>
                <service.icon className="size-10 mb-2 text-primary" />
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{service.price}</span>
                  <span className="text-sm text-muted-foreground ml-2">/{service.duration}</span>
                </div>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={service.popular ? "default" : "outline"}>
                  Solicitar Información
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
    <section id="nosotros" className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sobre Nosotros</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Misión</h3>
                <p className="text-muted-foreground">
                  Formar conductores competentes y responsables mediante práctica intensiva en circuito homologado bajo estándares oficiales, logrando que cada alumno domine el vehículo, supere los nervios y apruebe el examen de licencia en su primer intento.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Visión</h3>
                <p className="text-muted-foreground">
                  Consolidarnos como la academia de manejo más recomendada de Ayacucho, siendo referente regional en seguridad vial, metodología pedagógica paciente y atención al cliente.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <Shield className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Vehículos con Doble Comando</h3>
              <p className="text-sm text-muted-foreground">
                Todos los vehículos disponen de doble mando para intervención inmediata del instructor.
              </p>
            </Card>
            <Card className="p-6">
              <MapPin className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Circuito Homologado</h3>
              <p className="text-sm text-muted-foreground">
                Pista de manejo diseñada bajo los estándares y dimensiones del examen oficial.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Instructores Expertos</h3>
              <p className="text-sm text-muted-foreground">
                Profesionales certificados con metodología comprobada y paciente.
              </p>
            </Card>
            <Card className="p-6">
              <Award className="size-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Alta Tasa de Aprobación</h3>
              <p className="text-sm text-muted-foreground">
                Preparación integral que garantiza la aprobación en el primer intento.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQs() {
  const faqs = [
    {
      question: "¿Necesito experiencia previa para inscribirme?",
      answer: "No. El Paquete San Cristóbal está diseñado para iniciar desde nivel cero. La metodología es progresiva y el instructor adapta el ritmo al nivel real del alumno.",
    },
    {
      question: "¿Los vehículos cuentan con doble comando?",
      answer: "Sí. Todos los vehículos de la flota disponen de doble mando, lo que garantiza la intervención inmediata del instructor ante cualquier situación de riesgo.",
    },
    {
      question: "¿Cuánto cuesta la práctica en el circuito?",
      answer: "La tarifa es de S/ 40.00 por hora, aplicable al Circuito Libre y al Simulacro Tipo Examen. El Paquete San Cristóbal tiene tarifa diferenciada; consultar al momento de la inscripción.",
    },
    {
      question: "¿Cuál es el horario de atención?",
      answer: "La academia atiende de lunes a viernes de 8:00 a.m. a 6:00 p.m. Las consultas fuera de ese horario serán respondidas el siguiente día hábil.",
    },
    {
      question: "¿Qué pasa si no aprobo el examen oficial?",
      answer: "Los alumnos del Paquete San Cristóbal tienen derecho a sesiones de refuerzo y un nuevo simulacro sin costo adicional hasta lograr la aprobación.",
    },
    {
      question: "¿Puedo alquilar el circuito sin inscribirme en un paquete?",
      answer: "Sí, mediante el servicio Circuito Libre a S/ 40.00 por hora. Se requiere reserva previa con mínimo de 1 hora dentro del horario de atención.",
    },
    {
      question: "¿La academia ayuda con los trámites de la licencia?",
      answer: "Sí. El servicio de Asesoría en Trámites guía al alumno paso a paso en la programación de su cita y el cumplimiento de los requisitos documentarios ante la autoridad competente.",
    },
    {
      question: "¿Cómo llego a la academia?",
      answer: "Dirección: Jr. Los Morochucos N° 349, Ayacucho, a unas cuadras del Arco Magisterial. Puedes llegar tomando la Ruta 7 o la Ruta 12 del transporte público.",
    },
  ]

  return (
    <section id="preguntas" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas? ¿Quieres agendar una clase? Escríbenos y nos pondremos en contacto contigo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un mensaje</CardTitle>
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
                      Teléfono
                    </label>
                    <Input id="phone" type="tel" placeholder="+51 999 999 999" />
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
                    placeholder="¿En qué podemos ayudarte?"
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
                  <MapPin className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Ubicación</h3>
                    <p className="text-muted-foreground">Jr. Los Morochucos N° 349, Ayacucho</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      A unas cuadras del Arco Magisterial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Clock className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Horario de Atención</h3>
                    <p className="text-muted-foreground">Lunes a Viernes: 8:00 a.m. – 6:00 p.m.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sábados: Cerrado · Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Transporte Público</h3>
                    <p className="text-muted-foreground">Ruta 7 (deja a pasos del circuito)</p>
                    <p className="text-muted-foreground">Ruta 12 (acceso directo)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Phone className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <p className="text-muted-foreground">Canal principal de reservas y consultas</p>
                    <Button className="mt-2 bg-green-600 hover:bg-green-700" asChild>
                      <a href="https://wa.me/51992684562" target="_blank" rel="noopener noreferrer">
                        Escribir por WhatsApp
                      </a>
                    </Button>
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

export default function Home() {
  return (
    <>
      <Hero />
      <Values />
      <Services />
      <About />
      <FAQs />
      <Contact />
    </>
  )
}
