import { redirect } from "next/navigation"
import { verifySession } from "@/lib/dal"
import { getReservas } from "@/services/admin-reservas.service"
import { getAlumnos, Alumno } from "@/services/admin-alumnos.service"
import { getServicios, Servicio } from "@/services/admin-reservas.service"
import { DataWarning } from "@/components/data-warning"
import { AdminReservasClient } from "./reservas-client"

const AdminReservasPage = async (): Promise<React.ReactNode> => {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  const [reservasResult, alumnosResult, serviciosResult] = await Promise.allSettled([
    getReservas(),
    getAlumnos(),
    getServicios(),
  ])
  const reservas: Parameters<typeof AdminReservasClient>[0]["initialReservas"] =
    reservasResult.status === "fulfilled" ? reservasResult.value : []
  const alumnos: Alumno[] = alumnosResult.status === "fulfilled" ? alumnosResult.value : []
  const servicios: Servicio[] = serviciosResult.status === "fulfilled" ? serviciosResult.value : []
  const dataError = [reservasResult, alumnosResult, serviciosResult].find((result) => result.status === "rejected")
  const warning = dataError?.status === "rejected"
    ? dataError.reason instanceof Error
      ? dataError.reason.message
      : "No se pudieron cargar las reservas"
    : null

  return (
    <div className="space-y-4">
      <DataWarning message={warning} />
      <AdminReservasClient initialReservas={reservas} alumnos={alumnos} servicios={servicios} />
    </div>
  )
}

export default AdminReservasPage
