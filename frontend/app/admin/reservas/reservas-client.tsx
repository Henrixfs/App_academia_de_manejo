"use client"

import { useState } from "react"
import { Calendar, Plus, Edit, XCircle, CheckCircle, AlertCircle, User, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { adminPost } from "@/lib/admin-browser-client"
import { ConfirmDialog, FeedbackMessage } from "@/components/feedback"

interface Reserva {
  id: string
  alumno_id: string
  servicio_id: string
  matricula_paquete_id: string | null
  fecha_hora_inicio: string
  fecha_hora_fin: string
  estado: string
  estado_pago: string
  fecha_creacion: string
}

interface AdminReservasClientProps {
  initialReservas: Reserva[]
  alumnos: { id: string; nombres: string; apellidos: string; documento_identidad: string }[]
  servicios: { id: string; nombre: string; descripcion: string; tarifa: number; tiempo_minimo_horas: number }[]
}

const ITEMS_PER_PAGE = 10

const estadoConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle }> = {
  pendiente_confirmacion: { label: "Pendiente", className: "badge-warning", icon: AlertCircle },
  confirmada: { label: "Confirmada", className: "badge-info", icon: CheckCircle },
  asistida: { label: "Asistida", className: "badge-success", icon: CheckCircle },
  no_asistio: { label: "No Asistio", className: "badge-danger", icon: XCircle },
  cancelada: { label: "Cancelada", className: "badge-neutral", icon: XCircle },
  reprogramada: { label: "Reprogramada", className: "badge-neutral", icon: AlertCircle },
}

const estadosCancelables = ["pendiente_confirmacion", "confirmada"]

export const AdminReservasClient = ({ initialReservas, alumnos, servicios }: AdminReservasClientProps): React.ReactNode => {
  const [reservas, setReservas] = useState<Reserva[]>(initialReservas)
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [currentPage, setCurrentPage] = useState(1)

  // Modal crear reserva
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    alumno_id: "",
    servicio_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  })

  // Modal reprogramar reserva
  const [isReprogramarModalOpen, setIsReprogramarModalOpen] = useState(false)
  const [reprogramarReservaId, setReprogramarReservaId] = useState<string | null>(null)
  const [reprogramarForm, setReprogramarForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  })

  const alumnoMap = new Map(alumnos.map(a => [a.id, a]))
  const servicioMap = new Map(servicios.map(s => [s.id, s]))

  const buildLimaDateTime = (fecha: string, hora: string) => `${fecha}T${hora}:00-05:00`

  const validateHorario = (
    fecha: string,
    horaInicio: string,
    horaFin: string,
    servicioId: string
  ): string | null => {
    const servicio = servicioMap.get(servicioId)
    const inicio = new Date(buildLimaDateTime(fecha, horaInicio))
    const fin = new Date(buildLimaDateTime(fecha, horaFin))
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      return "Selecciona una fecha y horas validas"
    }
    if (fin <= inicio) {
      return "La hora de fin debe ser posterior a la hora de inicio"
    }
    if (horaInicio < "08:00" || horaFin > "18:00") {
      return "El horario de atencion es de 08:00 a 18:00"
    }
    const durationHours = (fin.getTime() - inicio.getTime()) / 3_600_000
    if (servicio && durationHours < servicio.tiempo_minimo_horas) {
      return `La duracion minima para ${servicio.nombre} es de ${servicio.tiempo_minimo_horas} hora(s)`
    }
    return null
  }

  const filteredReservas = reservas.filter((reserva) => {
    if (statusFilter === "todos") return true
    return reserva.estado === statusFilter
  })

  const totalPages = Math.max(1, Math.ceil(filteredReservas.length / ITEMS_PER_PAGE))
  const paginatedReservas = filteredReservas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ─── Crear reserva ─────────────────────────────────────────────────────────

  const handleOpenCreateModal = () => {
    setFormData({ alumno_id: "", servicio_id: "", fecha: "", hora_inicio: "", hora_fin: "" })
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)
    try {
      const validationMessage = validateHorario(
        formData.fecha,
        formData.hora_inicio,
        formData.hora_fin,
        formData.servicio_id
      )
      if (validationMessage) {
        setErrorMessage(validationMessage)
        setIsLoading(false)
        return
      }
      const fechaHoraInicio = buildLimaDateTime(formData.fecha, formData.hora_inicio)
      const fechaHoraFin = buildLimaDateTime(formData.fecha, formData.hora_fin)

      const nuevaReserva = await adminPost<Reserva>('reservas', {
        alumno_id: formData.alumno_id,
        servicio_id: formData.servicio_id,
        fecha_hora_inicio: fechaHoraInicio,
        fecha_hora_fin: fechaHoraFin,
      })

      setReservas(prev => [nuevaReserva, ...prev])
      handleCloseCreateModal()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al crear la reserva")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Cancelar reserva ──────────────────────────────────────────────────────

  const handleCancelar = (id: string): void => setCancelTarget(id)

  const confirmCancelar = async (): Promise<void> => {
    if (!cancelTarget) return
    setErrorMessage(null)
    setIsLoading(true)
    try {
      const updated = await adminPost<Reserva>(`reservas/${cancelTarget}/cancelar`, {})
      setReservas((current) => current.map((reserva) => reserva.id === cancelTarget ? updated : reserva))
      setCancelTarget(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al cancelar la reserva")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Reprogramar reserva ────────────────────────────────────────────────────

  const handleOpenReprogramarModal = (reserva: Reserva) => {
    const inicio = new Date(reserva.fecha_hora_inicio)
    const fin = new Date(reserva.fecha_hora_fin)
    const toLimaDate = (d: Date) =>
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(d)
    const toLimaTime = (d: Date) =>
      new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false }).format(d)

    setReprogramarReservaId(reserva.id)
    setReprogramarForm({
      fecha: toLimaDate(inicio),
      hora_inicio: toLimaTime(inicio),
      hora_fin: toLimaTime(fin),
    })
    setIsReprogramarModalOpen(true)
  }

  const handleCloseReprogramarModal = () => {
    setIsReprogramarModalOpen(false)
    setReprogramarReservaId(null)
  }

  const handleSubmitReprogramar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reprogramarReservaId) return
    setErrorMessage(null)
    setIsLoading(true)
    try {
      const reserva = reservas.find((item) => item.id === reprogramarReservaId)
      const validationMessage = validateHorario(
        reprogramarForm.fecha,
        reprogramarForm.hora_inicio,
        reprogramarForm.hora_fin,
        reserva?.servicio_id || ""
      )
      if (validationMessage) {
        setErrorMessage(validationMessage)
        setIsLoading(false)
        return
      }
      const nuevaInicio = buildLimaDateTime(reprogramarForm.fecha, reprogramarForm.hora_inicio)
      const nuevaFin = buildLimaDateTime(reprogramarForm.fecha, reprogramarForm.hora_fin)

      const updated = await adminPost<Reserva>(`reservas/${reprogramarReservaId}/reprogramar`, {
        nueva_fecha_hora_inicio: nuevaInicio,
        nueva_fecha_hora_fin: nuevaFin,
      })

      setReservas(prev => prev.map(r => r.id === reprogramarReservaId ? updated : r))
      handleCloseReprogramarModal()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al reprogramar la reserva")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Helpers UI ─────────────────────────────────────────────────────────────

  const getEstadoBadge = (estado: string) => {
    const config = estadoConfig[estado] || estadoConfig.pendiente_confirmacion
    const Icon = config.icon
    return (
      <span className={`badge-modern ${config.className}`}>
        <Icon className="size-3" />
        {config.label}
      </span>
    )
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-PE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="container admin-page">
      <div className="admin-page-heading mb-8 flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Reservas</h1>
          <p className="text-muted-foreground">Administre las citas, clases y simulacros programados.</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="button-gold gap-2">
          <Plus className="size-4" />
          Nueva Reserva
        </Button>
      </div>

      <FeedbackMessage message={errorMessage} />

      {/* Filtros */}
      <Card className="mb-6 border-border/60 shadow-admin-card bg-gradient-to-r from-card to-muted/20">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {["todos", "pendiente_confirmacion", "confirmada", "asistida", "cancelada", "reprogramada"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(status)
                  setCurrentPage(1)
                }}
                className={`text-xs transition-all ${statusFilter === status ? "shadow-sm" : ""}`}
              >
                {status === "todos" ? "Todos" : estadoConfig[status]?.label || status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="border-border/60 shadow-admin-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="table-header-modern">
              <tr>
                <th className="py-3.5 px-4">Alumno</th>
                <th className="py-3.5 px-4">Servicio</th>
                <th className="py-3.5 px-4">Fecha/Hora Inicio</th>
                <th className="py-3.5 px-4">Fecha/Hora Fin</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {paginatedReservas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No hay reservas para mostrar
                  </td>
                </tr>
              ) : (
                paginatedReservas.map((reserva) => (
                  <tr key={reserva.id} className="table-row-hover">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="size-4 text-primary" />
                        </div>
                        <span className="font-medium">
                          {alumnoMap.get(reserva.alumno_id)
                            ? `${alumnoMap.get(reserva.alumno_id)!.nombres} ${alumnoMap.get(reserva.alumno_id)!.apellidos}`
                            : reserva.alumno_id.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-muted-foreground">
                        {servicioMap.get(reserva.servicio_id)?.nombre || reserva.servicio_id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{formatDateTime(reserva.fecha_hora_inicio)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-muted-foreground">{formatDateTime(reserva.fecha_hora_fin)}</span>
                    </td>
                    <td className="py-3 px-4">{getEstadoBadge(reserva.estado)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-1">
                        {estadosCancelables.includes(reserva.estado) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="btn-action-cancel size-8"
                            title="Cancelar reserva"
                            onClick={() => handleCancelar(reserva.id)}
                            disabled={isLoading}
                          >
                            <XCircle className="size-4" />
                          </Button>
                        )}
                        {estadosCancelables.includes(reserva.estado) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="btn-action-edit size-8"
                            title="Reprogramar reserva"
                            onClick={() => handleOpenReprogramarModal(reserva)}
                            disabled={isLoading}
                          >
                            <Edit className="size-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Vista móvil */}
        <div className="md:hidden flex flex-col divide-y divide-border">
          {paginatedReservas.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No hay reservas para mostrar
            </div>
          ) : (
            paginatedReservas.map((reserva) => (
              <div key={reserva.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {alumnoMap.get(reserva.alumno_id)
                        ? `${alumnoMap.get(reserva.alumno_id)!.nombres} ${alumnoMap.get(reserva.alumno_id)!.apellidos}`
                        : `Alumno: ${reserva.alumno_id.slice(0, 8)}...`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {servicioMap.get(reserva.servicio_id)?.nombre || `Servicio: ${reserva.servicio_id.slice(0, 8)}...`}
                    </p>
                  </div>
                  {getEstadoBadge(reserva.estado)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>{formatDateTime(reserva.fecha_hora_inicio)}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{formatDateTime(reserva.fecha_hora_fin)}</span>
                </div>
                {estadosCancelables.includes(reserva.estado) && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 btn-action-cancel"
                      onClick={() => handleCancelar(reserva.id)}
                      disabled={isLoading}
                    >
                      <XCircle className="size-3.5" />
                      Cancelar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 btn-action-edit"
                      onClick={() => handleOpenReprogramarModal(reserva)}
                      disabled={isLoading}
                    >
                      <RefreshCw className="size-3.5" />
                      Reprogramar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between bg-gradient-to-r from-muted/30 to-card">
          <span className="text-xs text-muted-foreground">
            {filteredReservas.length === 0
              ? "Sin resultados"
              : `Mostrando ${((currentPage - 1) * ITEMS_PER_PAGE) + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredReservas.length)} de ${filteredReservas.length} reservas`
            }
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── Modal: Nueva Reserva ─── */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nueva Reserva</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="alumno" className="text-sm font-medium">Alumno</label>
              <select
                id="alumno"
                className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.alumno_id}
                onChange={(e) => setFormData({ ...formData, alumno_id: e.target.value })}
                required
              >
                <option value="">Seleccionar alumno...</option>
                {alumnos.map((alumno) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombres} {alumno.apellidos} — {alumno.documento_identidad}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="servicio" className="text-sm font-medium">Servicio</label>
              <select
                id="servicio"
                className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.servicio_id}
                onChange={(e) => setFormData({ ...formData, servicio_id: e.target.value })}
                required
              >
                <option value="">Seleccionar servicio...</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} — S/ {servicio.tarifa}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="fecha_create" className="text-sm font-medium">Fecha</label>
              <Input
                id="fecha_create"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="hora_inicio_create" className="text-sm font-medium">Hora Inicio</label>
                <Input
                  id="hora_inicio_create"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                  required
                  min="08:00"
                  max="18:00"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="hora_fin_create" className="text-sm font-medium">Hora Fin</label>
                <Input
                  id="hora_fin_create"
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                  required
                  min="08:00"
                  max="18:00"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseCreateModal} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Reserva"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancelar reserva"
        description="La reserva cambiará a estado cancelado y ya no podrá confirmarse ni reprogramarse."
        loading={isLoading}
        onCancel={() => setCancelTarget(null)}
        onConfirm={confirmCancelar}
      />

      {/* ─── Modal: Reprogramar Reserva ─── */}
      <Dialog open={isReprogramarModalOpen} onOpenChange={setIsReprogramarModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Reprogramar Reserva</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReprogramar} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ingresa la nueva fecha y horario para esta reserva.
            </p>
            <div className="space-y-2">
              <label htmlFor="fecha_reprogram" className="text-sm font-medium">Nueva Fecha</label>
              <Input
                id="fecha_reprogram"
                type="date"
                value={reprogramarForm.fecha}
                onChange={(e) => setReprogramarForm({ ...reprogramarForm, fecha: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="hora_inicio_reprogram" className="text-sm font-medium">Hora Inicio</label>
                <Input
                  id="hora_inicio_reprogram"
                  type="time"
                  value={reprogramarForm.hora_inicio}
                  onChange={(e) => setReprogramarForm({ ...reprogramarForm, hora_inicio: e.target.value })}
                  required
                  min="08:00"
                  max="18:00"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="hora_fin_reprogram" className="text-sm font-medium">Hora Fin</label>
                <Input
                  id="hora_fin_reprogram"
                  type="time"
                  value={reprogramarForm.hora_fin}
                  onChange={(e) => setReprogramarForm({ ...reprogramarForm, hora_fin: e.target.value })}
                  required
                  min="08:00"
                  max="18:00"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseReprogramarModal} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Reprogramando...
                  </>
                ) : (
                  "Reprogramar"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
