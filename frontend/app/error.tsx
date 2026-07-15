'use client'

import { Button } from '@/components/ui/button'


interface ErrorPageProps {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

const ErrorPage = ({ error, unstable_retry }: ErrorPageProps): React.ReactNode => (
  <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <h1 className="text-2xl font-bold">No pudimos cargar esta sección</h1>
    <p className="max-w-lg text-muted-foreground">{error.message || 'Ocurrió un error inesperado.'}</p>
    <Button onClick={unstable_retry}>Intentar nuevamente</Button>
  </main>
)

export default ErrorPage
