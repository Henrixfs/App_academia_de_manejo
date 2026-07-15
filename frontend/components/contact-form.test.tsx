import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ContactForm } from '@/components/contact-form'


describe('ContactForm', () => {
  it('abre WhatsApp solamente después de completar el formulario', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: /enviar por whatsapp/i }))
    expect(open).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/nombre/i), 'Ana Torres')
    await user.type(screen.getByLabelText(/teléfono/i), '999999999')
    await user.type(screen.getByLabelText(/email/i), 'ana@example.com')
    await user.type(screen.getByLabelText(/mensaje/i), 'Quiero información de clases.')
    await user.click(screen.getByRole('button', { name: /enviar por whatsapp/i }))

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/51992684562?text='),
      '_blank',
      'noopener,noreferrer',
    )
    expect(screen.getByRole('status')).toHaveTextContent(/abrimos whatsapp/i)
  })

  it('normaliza campos ausentes antes de construir el enlace', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { container } = render(<ContactForm />)
    fireEvent.submit(container.querySelector('form') as HTMLFormElement)
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/51992684562?text='),
      '_blank',
      'noopener,noreferrer',
    )
  })
})
