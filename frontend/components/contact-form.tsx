'use client'

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'


export const ContactForm = (): React.ReactNode => {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = [
      `Hola, soy ${String(data.get('name') || '')}.`,
      String(data.get('message') || ''),
      `Teléfono: ${String(data.get('phone') || '')}`,
      `Email: ${String(data.get('email') || '')}`,
    ].join('\n')
    window.open(`https://wa.me/51992684562?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Nombre</label>
          <Input id="name" name="name" placeholder="Tu nombre" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Teléfono</label>
          <Input id="phone" name="phone" type="tel" placeholder="+51 999 999 999" autoComplete="tel" required />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input id="email" name="email" type="email" placeholder="tu@email.com" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
        <Textarea id="message" name="message" className="min-h-[120px]" placeholder="¿En qué podemos ayudarte?" required />
      </div>
      <Button type="submit" className="w-full">Enviar por WhatsApp</Button>
      {sent && <p className="text-sm text-muted-foreground" role="status">Abrimos WhatsApp con tu mensaje listo para enviar.</p>}
    </form>
  )
}
