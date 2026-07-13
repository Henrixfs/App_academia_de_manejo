import { redirect } from "next/navigation"

import { verifySession } from "@/lib/dal"
import { getServicios } from "@/services/admin-servicios.service"
import { AdminServiciosClient } from "./servicios-client"

export default async function AdminServiciosPage() {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  let servicios: Awaited<ReturnType<typeof getServicios>> = []

  try {
    servicios = await getServicios()
  } catch (error) {
    console.error("Error fetching servicios:", error)
  }

  return <AdminServiciosClient initialServicios={servicios} />
}
