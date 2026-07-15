'use client'

import * as React from 'react'
import Link from 'next/link'
import { useActionState } from 'react'
import { Car, Loader2 } from 'lucide-react'

import { setupInitialAdmin, type SetupState } from '@/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: SetupState = {}

interface FieldProps {
  label: string
  name: string
  type?: string
  autoComplete?: string
  error?: string[]
  disabled: boolean
}

const Field = ({ label, name, type = 'text', autoComplete, error, disabled }: FieldProps): React.ReactNode => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} name={name} type={type} autoComplete={autoComplete} disabled={disabled} required={name !== 'telefono'} />
    {error && <p className="text-sm text-destructive">{error.join(' ')}</p>}
  </div>
)

export const InitialSetupForm = (): React.ReactNode => {
  const [state, action, pending] = useActionState(setupInitialAdmin, initialState)

  React.useEffect(() => {
    if (state.success) window.location.assign('/admin')
  }, [state.success])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="mb-2 flex justify-center"><div className="rounded-full bg-primary/10 p-3"><Car className="size-8 text-primary" /></div></div>
        <h1 className="font-heading text-center text-2xl font-medium">Configura el administrador inicial</h1>
        <CardDescription className="text-center">Esta pantalla solo está disponible durante la configuración local inicial.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombres" name="nombres" error={state.errors?.nombres} disabled={pending} />
            <Field label="Apellidos" name="apellidos" error={state.errors?.apellidos} disabled={pending} />
          </div>
          <Field label="Email" name="email" type="email" autoComplete="email" error={state.errors?.email} disabled={pending} />
          <Field label="Teléfono" name="telefono" type="tel" autoComplete="tel" error={state.errors?.telefono} disabled={pending} />
          <Field label="Contraseña" name="password" type="password" autoComplete="new-password" error={state.errors?.password} disabled={pending} />
          <Field label="Confirmar contraseña" name="password_confirmation" type="password" autoComplete="new-password" error={state.errors?.password_confirmation} disabled={pending} />
          {state.message && <p className="text-sm text-destructive" role="alert">{state.message}</p>}
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? <><Loader2 className="size-4 animate-spin" />Creando administrador...</> : 'Crear administrador y entrar'}
          </Button>
          <p className="text-center text-sm text-muted-foreground"><Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">Volver al inicio de sesión</Link></p>
        </form>
      </CardContent>
    </Card>
  )
}
