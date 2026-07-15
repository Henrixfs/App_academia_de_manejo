import type { Metadata } from 'next'
import { CalendarDays, UserRound } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAlumnoProfile, getAlumnoReservas } from '@/services/dashboard.service'


export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Consulta tu perfil y tus reservas en la academia.',
}

const CuentaPage = async (): Promise<React.ReactNode> => {
  const [profile, reservas] = await Promise.all([
    getAlumnoProfile(),
    getAlumnoReservas(),
  ])
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mi cuenta</h1>
        <p className="text-muted-foreground">Consulta tus datos y próximas clases.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="size-5" /> Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{profile.nombres} {profile.apellidos}</p>
            <p className="text-muted-foreground">Documento: {profile.documento_identidad}</p>
            <p className="text-muted-foreground">Teléfono: {profile.telefono}</p>
            <p className="text-muted-foreground">Email: {profile.email || 'No registrado'}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="size-5" /> Mis reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {reservas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no tienes reservas registradas.</p>
            ) : (
              <div className="space-y-3">
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="flex flex-col gap-1 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium">{new Date(reserva.fecha_hora_inicio).toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
                    <span className="text-sm capitalize text-muted-foreground">{reserva.estado.replaceAll('_', ' ')}</span>
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

export default CuentaPage
