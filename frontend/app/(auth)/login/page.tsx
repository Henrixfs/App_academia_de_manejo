"use client"

import * as React from "react"
import Link from "next/link"
import { useActionState } from "react"
import { Car, Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login, LoginState } from "@/actions/auth.actions"

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    if (state?.success && state?.redirectUrl) {
      window.location.href = state.redirectUrl
    }
  }, [state])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-primary/10">
            <Car className="size-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Iniciar Sesion</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder a tu cuenta
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
              placeholder="DNI, Carnet de Extranjeria o Email"
              required
              disabled={pending}
            />
            {state?.errors?.username && (
              <p className="text-sm text-destructive">{state.errors.username}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contrasena</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contrasena"
                required
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
              >
                {showPassword ? (
                  <EyeOff className="size-4 text-muted-foreground" />
                ) : (
                  <Eye className="size-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                </span>
              </Button>
            </div>
            {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password}</p>
            )}
          </div>
          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Iniciar Sesion"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
