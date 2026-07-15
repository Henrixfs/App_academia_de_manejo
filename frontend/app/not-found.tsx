import Link from 'next/link'

import { Button } from '@/components/ui/button'


const NotFound = (): React.ReactNode => (
  <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <p className="text-sm font-medium text-primary">404</p>
    <h1 className="text-3xl font-bold">Página no encontrada</h1>
    <p className="text-muted-foreground">La dirección solicitada no existe o fue movida.</p>
    <Button asChild><Link href="/">Volver al inicio</Link></Button>
  </main>
)

export default NotFound
