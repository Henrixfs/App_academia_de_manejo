import Link from "next/link"
import { Car } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="size-6" />
            <span>Academia de Manejo</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  )
}
