import { redirect } from "next/navigation"
import { verifySession } from "@/lib/dal"
import { getReservas } from "@/services/admin-reservas.service"
import { getAlumnos, Alumno } from "@/services/admin-alumnos.service"
import { getServicios, Servicio } from "@/services/admin-reservas.service"
import { AdminReservasClient } from "./reservas-client"

interface AdminReservasPageProps {
  alumnos: Alumno[]
  servicios: Servicio[]
  reservas: Parameters<typeof AdminReservasClient>[0]["initialReservas"]
}

export default async function AdminReservasPage() {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  

  let reservas: Parameters<typeof AdminReservasClient>[0]["initialReservas"] = []
  let alumnos: Alumno[] = []
  let servicios: Servicio[] = []

  try {
    const [reservasData, alumnosData, serviciosData] = await Promise.all([
      getReservas(),
      getAlumnos(),
      getServicios(),
    ])
    reservas = reservasData
    alumnos = alumnosData
    servicios = serviciosData
  } catch (error) {
    console.error("Error fetching reservas:", error)
  }

  return <AdminReservasClient initialReservas={reservas} alumnos={alumnos} servicios={servicios} />
}
