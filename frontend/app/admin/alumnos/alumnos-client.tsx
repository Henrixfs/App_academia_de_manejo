"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Mail, Phone, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { adminDelete, adminPost, adminPut } from "@/lib/admin-browser-client"
import { ConfirmDialog, FeedbackMessage } from "@/components/feedback"

interface Alumno {
  id: string
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email: string | null
  fecha_registro: string
}

interface AlumnoFormData {
  nombres: string
  apellidos: string
  documento_identidad: string
  telefono: string
  email: string
}

interface AdminAlumnosClientProps {
  initialAlumnos: Alumno[]
}

const ITEMS_PER_PAGE = 10

export const AdminAlumnosClient = ({ initialAlumnos }: AdminAlumnosClientProps): React.ReactNode => {
  const [alumnos, setAlumnos] = useState<Alumno[]>(initialAlumnos)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [formData, setFormData] = useState<AlumnoFormData>({
    nombres: "",
    apellidos: "",
    documento_identidad: "",
    telefono: "",
    email: "",
  })

  const filteredAlumnos = alumnos.filter((alumno) => {
    const matchesSearch =
      searchQuery === "" ||
      `${alumno.nombres} ${alumno.apellidos}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumno.documento_identidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alumno.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filteredAlumnos.length / ITEMS_PER_PAGE))
  const paginatedAlumnos = filteredAlumnos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleOpenModal = (alumno?: Alumno) => {
    if (alumno) {
      setEditingAlumno(alumno)
      setFormData({
        nombres: alumno.nombres,
        apellidos: alumno.apellidos,
        documento_identidad: alumno.documento_identidad,
        telefono: alumno.telefono,
        email: alumno.email || "",
      })
    } else {
      setEditingAlumno(null)
      setFormData({
        nombres: "",
        apellidos: "",
        documento_identidad: "",
        telefono: "",
        email: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAlumno(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)
    try {
      if (editingAlumno) {
        const updated = await adminPut<Alumno>(`alumnos/${editingAlumno.id}`, {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          email: formData.email || undefined,
        })
        setAlumnos(alumnos.map(a => a.id === editingAlumno.id ? updated : a))
      } else {
        const newAlumno = await adminPost<Alumno>('alumnos', {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          documento_identidad: formData.documento_identidad,
          telefono: formData.telefono,
          email: formData.email || undefined,
        })
        setAlumnos(prev => [newAlumno, ...prev])
      }
      handleCloseModal()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al guardar el alumno")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id: string): void => setDeleteTarget(id)

  const confirmDelete = async (): Promise<void> => {
    if (!deleteTarget) return
    setErrorMessage(null)
    setIsLoading(true)
    try {
      await adminDelete<void>(`alumnos/${deleteTarget}`)
      setAlumnos((current) => current.filter((alumno) => alumno.id !== deleteTarget))
      setDeleteTarget(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al eliminar el alumno")
    } finally {
      setIsLoading(false)
    }
  }

  const getEstadoBadge = () => {
    return (
      <span className="badge-modern badge-success">
        Activo
      </span>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administración de Alumnos</h1>
          <p className="text-muted-foreground">Gestione los registros de estudiantes, seguimiento y evaluaciones.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="size-4" />
          Nuevo Alumno
        </Button>
      </div>

      <FeedbackMessage message={errorMessage} />

      <Card className="mb-6 border-border/60 shadow-admin-card bg-gradient-to-r from-card to-muted/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por Nombre, DNI o Email..."
                className="pl-10 bg-card border-border/60 focus:border-primary/50 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-admin-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="table-header-modern">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Nombre Completo</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">DNI</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {paginatedAlumnos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    {searchQuery ? "No se encontraron resultados" : "No hay alumnos registrados"}
                  </td>
                </tr>
              ) : (
                paginatedAlumnos.map((alumno) => (
                  <tr key={alumno.id} className="table-row-hover">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                      AL-{alumno.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-xs">
                          {alumno.nombres.charAt(0)}{alumno.apellidos.charAt(0)}
                        </div>
                        <span>{alumno.nombres} {alumno.apellidos}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {alumno.email || "Sin email"}
                    </td>
                    <td className="py-3 px-4">{alumno.telefono}</td>
                    <td className="py-3 px-4 text-muted-foreground">{alumno.documento_identidad}</td>
                    <td className="py-3 px-4">{getEstadoBadge()}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="btn-action-edit size-8"
                          onClick={() => handleOpenModal(alumno)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="btn-action-delete size-8"
                          onClick={() => handleDelete(alumno.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col divide-y divide-border/60">
          {paginatedAlumnos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {searchQuery ? "No se encontraron resultados" : "No hay alumnos registrados"}
            </div>
          ) : (
            paginatedAlumnos.map((alumno) => (
              <div key={alumno.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                      {alumno.nombres.charAt(0)}{alumno.apellidos.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{alumno.nombres} {alumno.apellidos}</h3>
                      <span className="text-xs text-muted-foreground">
                        AL-{alumno.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {getEstadoBadge()}
                </div>
                <div className="text-sm text-muted-foreground space-y-1.5 pl-13">
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground/60" />
                    {alumno.email || "Sin email"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground/60" />
                    {alumno.telefono}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-muted-foreground/60" />
                    {new Date(alumno.fecha_registro).toLocaleDateString("es-PE")}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 btn-action-edit"
                    onClick={() => handleOpenModal(alumno)}
                  >
                    <Edit className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 btn-action-delete"
                    onClick={() => handleDelete(alumno.id)}
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between bg-gradient-to-r from-muted/30 to-card">
          <span className="text-xs text-muted-foreground">
            {filteredAlumnos.length === 0
              ? "Sin resultados"
              : `Mostrando ${((currentPage - 1) * ITEMS_PER_PAGE) + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredAlumnos.length)} de ${filteredAlumnos.length} registros`
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAlumno ? "Editar Alumno" : "Nuevo Alumno"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombres" className="text-sm font-medium">
                  Nombres
                </label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellidos" className="text-sm font-medium">
                  Apellidos
                </label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="documento_identidad" className="text-sm font-medium">
                DNI
              </label>
              <Input
                id="documento_identidad"
                value={formData.documento_identidad}
                onChange={(e) => setFormData({ ...formData, documento_identidad: e.target.value })}
                required={!editingAlumno}
                disabled={!!editingAlumno}
                className={editingAlumno ? "bg-muted text-muted-foreground cursor-not-allowed font-medium" : ""}
              />
              {editingAlumno && (
                <p className="text-[11px] text-muted-foreground">El DNI no se puede modificar.</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="telefono" className="text-sm font-medium">
                Teléfono
              </label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-muted-foreground font-normal">(Opcional)</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingAlumno ? "Guardar Cambios" : "Crear Alumno"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar alumno"
        description="Esta acción no se puede deshacer. El alumno se eliminará si no tiene registros relacionados."
        loading={isLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
