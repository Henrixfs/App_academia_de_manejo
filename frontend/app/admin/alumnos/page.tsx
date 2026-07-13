import { redirect } from "next/navigation"
import { verifySession } from "@/lib/dal"
import { getAlumnos } from "@/services/admin-alumnos.service"
import { AdminAlumnosClient } from "./alumnos-client"

export default async function AdminAlumnosPage() {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  

  let alumnos: Awaited<ReturnType<typeof getAlumnos>> = []

  try {
    alumnos = await getAlumnos()
  } catch (error) {
    console.error("Error fetching alumnos:", error)
  }

  return <AdminAlumnosClient initialAlumnos={alumnos} />
}
