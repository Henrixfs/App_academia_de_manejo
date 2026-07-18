import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Footer } from '@/components/layout/footer'

describe('Footer', () => {
  it('mantiene la marca, enlaces públicos y contacto de la academia', () => {
    render(<Footer />)

    expect(screen.getByRole('img', { name: 'Logo Academia de Manejo San Cristóbal VIP' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sobre Nosotros' })).toHaveAttribute('href', '#nosotros')
    expect(screen.getByText('WhatsApp (canal principal)')).toBeInTheDocument()
  })
})
