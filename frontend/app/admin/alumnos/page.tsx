import { redirect } from "next/navigation"
import { verifySession } from "@/lib/dal"
import { getAlumnos } from "@/services/admin-alumnos.service"
import { DataWarning } from "@/components/data-warning"
import { AdminAlumnosClient } from "./alumnos-client"

const AdminAlumnosPage = async (): Promise<React.ReactNode> => {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  const alumnosResult = await Promise.allSettled([getAlumnos()])
  const alumnos = alumnosResult[0].status === "fulfilled" ? alumnosResult[0].value : []
  const warning = alumnosResult[0].status === "rejected"
    ? alumnosResult[0].reason instanceof Error
      ? alumnosResult[0].reason.message
      : "No se pudieron cargar los alumnos"
    : null

  return (
    <div className="space-y-4">
      <DataWarning message={warning} />
      <AdminAlumnosClient initialAlumnos={alumnos} />
    </div>
  )
}

export default AdminAlumnosPage
