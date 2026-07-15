import { redirect } from "next/navigation"

import { verifySession } from "@/lib/dal"
import { getServicios } from "@/services/admin-servicios.service"
import { DataWarning } from "@/components/data-warning"
import { AdminServiciosClient } from "./servicios-client"

const AdminServiciosPage = async (): Promise<React.ReactNode> => {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  const serviciosResult = await Promise.allSettled([getServicios()])
  const servicios = serviciosResult[0].status === "fulfilled" ? serviciosResult[0].value : []
  const warning = serviciosResult[0].status === "rejected"
    ? serviciosResult[0].reason instanceof Error
      ? serviciosResult[0].reason.message
      : "No se pudieron cargar los servicios"
    : null

  return (
    <div className="space-y-4">
      <DataWarning message={warning} />
      <AdminServiciosClient initialServicios={servicios} />
    </div>
  )
}

export default AdminServiciosPage
