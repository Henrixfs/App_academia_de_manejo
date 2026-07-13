"use client"

import { useState } from "react"
import { Settings, Car, Clock, DollarSign, Plus, Pencil, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { post, put, del } from "@/lib/client-api-client"

interface Servicio {
  id: string
  nombre: string
  descripcion: string
  tarifa: number
  tiempo_minimo_horas: number
}

interface AdminServiciosClientProps {
  initialServicios: Servicio[]
}

interface ServicioFormData {
  nombre: string
  descripcion: string
  tarifa: string
  tiempo_minimo_horas: string
}

export function AdminServiciosClient({ initialServicios }: AdminServiciosClientProps) {
  const [servicios, setServicios] = useState<Servicio[]>(initialServicios)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null)
  const [formData, setFormData] = useState<ServicioFormData>({
    nombre: "",
    descripcion: "",
    tarifa: "",
    tiempo_minimo_horas: "",
  })

  const handleOpenModal = (servicio?: Servicio) => {
    if (servicio) {
      setEditingServicio(servicio)
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        tarifa: servicio.tarifa.toString(),
        tiempo_minimo_horas: servicio.tiempo_minimo_horas.toString(),
      })
    } else {
      setEditingServicio(null)
      setFormData({
        nombre: "",
        descripcion: "",
        tarifa: "",
        tiempo_minimo_horas: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingServicio(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tarifa: parseFloat(formData.tarifa),
        tiempo_minimo_horas: parseInt(formData.tiempo_minimo_horas),
      }

      if (editingServicio) {
        const updated = await put(`/api/servicios/${editingServicio.id}`, data)
        setServicios(servicios.map(s => s.id === editingServicio.id ? updated as Servicio : s))
      } else {
        const created = await post('/api/servicios/', data)
        setServicios([...servicios, created as Servicio])
      }
      handleCloseModal()
    } catch (error) {
      console.error("Error al guardar servicio:", error)
      alert("Error al guardar el servicio")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      setIsLoading(true)
      try {
        await del(`/api/servicios/${id}`)
        setServicios(servicios.filter(s => s.id !== id))
      } catch (error) {
        console.error("Error al eliminar servicio:", error)
        alert("Error al eliminar el servicio")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Servicios</h1>
          <p className="text-muted-foreground">Configura los servicios ofrecidos</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shadow-sm">
          <Plus className="size-4" />
          Nuevo Servicio
        </Button>
      </div>

      {servicios.length === 0 ? (
        <Card className="border-border/60 shadow-admin-card">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Settings className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay servicios registrados</h3>
            <p className="text-muted-foreground mb-4">
              Crea los servicios que ofrece la academia
            </p>
            <Button onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="size-4" />
              Crear Servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio) => (
            <Card key={servicio.id} className="border-border/60 shadow-admin-card card-hover-effect overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-circle icon-circle-accent">
                      <Car className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="btn-action-edit size-8"
                      onClick={() => handleOpenModal(servicio)}
                      disabled={isLoading}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="btn-action-delete size-8"
                      onClick={() => handleDelete(servicio.id)}
                      disabled={isLoading}
                    >
                      <Trash className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4 line-clamp-2">{servicio.descripcion}</CardDescription>
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-4 text-secondary" />
                      {servicio.tiempo_minimo_horas} horas min.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <DollarSign className="size-4" />
                    {servicio.tarifa.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nombre" className="text-sm font-medium">
                Nombre
              </label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="descripcion" className="text-sm font-medium">
                Descripcion
              </label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tarifa" className="text-sm font-medium">
                  Tarifa (S/)
                </label>
                <Input
                  id="tarifa"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.tarifa}
                  onChange={(e) => setFormData({ ...formData, tarifa: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="tiempo_minimo_horas" className="text-sm font-medium">
                  Tiempo Minimo (horas)
                </label>
                <Input
                  id="tiempo_minimo_horas"
                  type="number"
                  min="1"
                  value={formData.tiempo_minimo_horas}
                  onChange={(e) => setFormData({ ...formData, tiempo_minimo_horas: e.target.value })}
                  required
                />
              </div>
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
                  editingServicio ? "Guardar Cambios" : "Crear Servicio"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
