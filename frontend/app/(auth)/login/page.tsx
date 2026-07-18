"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useActionState } from "react"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { login, LoginState } from "@/actions/auth.actions"

const initialState: LoginState = {}

const LoginPage = (): React.ReactNode => {
  const [state, action, pending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    if (state?.success && state?.redirectUrl) {
      window.location.href = state.redirectUrl
    }
  }, [state])

  return (
    <Card className="auth-card w-full max-w-md">
      <CardHeader className="space-y-2 pb-2">
        <div className="mb-2 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-3xl border border-secondary/25 bg-primary p-2 shadow-admin-primary">
            <Image src="/logo.png" alt="Logo Academia de Manejo San Cristóbal VIP" width={64} height={64} className="size-16 rounded-2xl object-contain" priority />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wide text-secondary">
          <ShieldCheck className="size-3.5" /> ACCESO SEGURO
        </div>
        <h1 className="font-heading text-center text-3xl font-semibold tracking-tight">Iniciar Sesión</h1>
        <CardDescription className="mx-auto max-w-sm text-center leading-6">
          Ingresa tus credenciales para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Documento o Email</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="DNI, Carnet de Extranjería o Email"
              required
              autoComplete="username"
              disabled={pending}
            />
            {state?.errors?.username && <p className="text-sm text-destructive">{state.errors.username}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
                disabled={pending}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={pending}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
                <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
              </Button>
            </div>
            {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password}</p>}
          </div>
          {state?.message && <p className="text-sm text-destructive" role="alert" aria-live="polite">{state.message}</p>}
          <Button type="submit" className="button-gold w-full" disabled={pending}>
            {pending ? <><Loader2 className="size-4 animate-spin" />Ingresando...</> : "Iniciar Sesión"}
          </Button>
          {process.env.NODE_ENV === "development" && (
            <p className="text-center text-sm text-muted-foreground">
              ¿Primera instalación? <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/setup">Configura el administrador inicial</Link>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default LoginPage
