import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Navbar } from '@/components/layout/navbar'

vi.mock('@/components/providers/theme-toogle', () => ({
  ThemeToggle: (): ReactNode => <button type="button">Cambiar tema</button>,
}))

describe('Navbar', () => {
  it('conserva la navegación existente y añade el acceso a inicio de sesión', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    expect(screen.getAllByRole('link', { name: 'Servicios' })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Nosotros' })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Preguntas' })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Contacto' })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Iniciar sesión' })).toHaveLength(1)

    screen.getAllByRole('link', { name: 'Iniciar sesión' }).forEach((loginLink) => {
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    await user.click(screen.getByRole('button', { name: /abrir/i }))

    expect(screen.getAllByRole('link', { name: 'Servicios' })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: 'Nosotros' })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: 'Preguntas' })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: 'Contacto' })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: 'Iniciar sesión' })).toHaveLength(2)
  })
})
