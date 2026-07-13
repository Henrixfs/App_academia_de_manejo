import { redirect } from "next/navigation"
import { Users, Calendar, CheckCircle, Clock, ArrowRight } from "lucide-react"

import { verifySession } from "@/lib/dal"
import { getAlumnos } from "@/services/admin-alumnos.service"
import { getReservas, getServicios } from "@/services/admin-reservas.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminPage() {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  let alumnos: Awaited<ReturnType<typeof getAlumnos>> = []
  let reservas: Awaited<ReturnType<typeof getReservas>> = []
  let servicios: Awaited<ReturnType<typeof getServicios>> = []

  try {
    alumnos = await getAlumnos()
    reservas = await getReservas()
    servicios = await getServicios()
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
  }

  const alumnoMap = new Map(alumnos.map(a => [a.id, a]))
  const servicioMap = new Map(servicios.map(s => [s.id, s]))

  const today = new Date().toISOString().split("T")[0]
  const reservasHoy = reservas.filter((r) => r.fecha_hora_inicio.startsWith(today))
  const reservasConfirmadas = reservas.filter((r) => r.estado === "confirmada").length
  const recentReservas = [...reservas].sort((a, b) =>
    new Date(b.fecha_hora_inicio).getTime() - new Date(a.fecha_hora_inicio).getTime()
  ).slice(0, 5)
  const recentAlumnos = [...alumnos].sort((a, b) =>
    new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()
  ).slice(0, 5)

  return (
    <div className="container py-8 space-y-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Panel de Administración</h1>
        <p className="text-muted-foreground">Resumen de la actividad de la academia</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Alumnos"
          value={alumnos.length}
          subtitle="Registrados en el sistema"
          icon={Users}
          gradient="stat-card-gradient-alumnos"
          iconClass="icon-circle-primary"
          href="/admin/alumnos"
        />
        <StatCard
          title="Reservas Hoy"
          value={reservasHoy.length}
          subtitle="Clases programadas"
          icon={Calendar}
          gradient="stat-card-gradient-reservas"
          iconClass="icon-circle-accent"
          href="/admin/reservas"
        />
        <StatCard
          title="Reservas Activas"
          value={reservasConfirmadas}
          subtitle="Confirmadas pendientes"
          icon={CheckCircle}
          gradient="stat-card-gradient-servicios"
          iconClass="icon-circle-secondary"
          href="/admin/reservas"
        />
        <StatCard
          title="Servicios"
          value={servicios.length}
          subtitle="Disponibles en la academia"
          icon={Clock}
          gradient="stat-card-gradient-activos"
          iconClass="icon-circle-warning"
          href="/admin/servicios"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-admin-card overflow-hidden animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-muted/30 to-card border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Reservas Recientes</CardTitle>
                <CardDescription>Últimas reservas registradas</CardDescription>
              </div>
              <Link href="/admin/reservas">
                <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
                  Ver todas <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {recentReservas.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No hay reservas recientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReservas.map((reserva) => {
                  const alumno = alumnoMap.get(reserva.alumno_id)
                  const servicio = servicioMap.get(reserva.servicio_id)
                  return (
                    <div key={reserva.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {alumno ? `${alumno.nombres} ${alumno.apellidos}` : `Alumno #${reserva.alumno_id.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {servicio?.nombre || "Servicio"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">{new Date(reserva.fecha_hora_inicio).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}</p>
                        <StatusBadge estado={reserva.estado} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-admin-card overflow-hidden animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-muted/30 to-card border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Alumnos Recientes</CardTitle>
                <CardDescription>Últimos alumnos registrados</CardDescription>
              </div>
              <Link href="/admin/alumnos">
                <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
                  Ver todos <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {recentAlumnos.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No hay alumnos registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAlumnos.map((alumno) => (
                  <div key={alumno.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                        {alumno.nombres.charAt(0)}{alumno.apellidos.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{alumno.nombres} {alumno.apellidos}</p>
                        <p className="text-xs text-muted-foreground">{alumno.documento_identidad}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{new Date(alumno.fecha_registro).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}</p>
                      <span className="badge-modern badge-success text-[10px]">Activo</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconClass,
  href,
}: {
  title: string
  value: number
  subtitle: string
  icon: any
  gradient: string
  iconClass: string
  href: string
}) {
  return (
    <Link href={href} className="block">
      <Card className={`${gradient} border-border/60 shadow-admin-stat card-hover-effect overflow-hidden`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="text-3xl font-bold tracking-tight">{value}</div>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <div className={`icon-circle ${iconClass}`}>
              <Icon className="size-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function StatusBadge({ estado }: { estado: string }) {
  const config: Record<string, { className: string; label: string }> = {
    pendiente_confirmacion: { className: "badge-warning", label: "Pendiente" },
    confirmada: { className: "badge-info", label: "Confirmada" },
    asistida: { className: "badge-success", label: "Asistida" },
    no_asistio: { className: "badge-danger", label: "No Asistió" },
    cancelada: { className: "badge-neutral", label: "Cancelada" },
    reprogramada: { className: "badge-neutral", label: "Reprogramada" },
  }

  const { className, label } = config[estado] || config.pendiente_confirmacion

  return <span className={`badge-modern ${className} text-[10px]`}>{label}</span>
}