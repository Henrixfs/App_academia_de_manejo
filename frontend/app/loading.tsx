import { Loader2 } from 'lucide-react'


const Loading = (): React.ReactNode => (
  <main className="flex min-h-[50vh] items-center justify-center" aria-busy="true" aria-live="polite">
    <div className="flex items-center gap-3 text-muted-foreground">
      <Loader2 className="size-5 animate-spin" />
      <span>Cargando…</span>
    </div>
  </main>
)

export default Loading
