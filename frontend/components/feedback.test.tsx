import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmDialog, FeedbackMessage } from '@/components/feedback'


describe('feedback', () => {
  it('presenta los errores como alertas accesibles', () => {
    render(<FeedbackMessage message="No se pudo guardar" />)
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar')
  })

  it('no reserva espacio cuando no existe un error', () => {
    render(<FeedbackMessage message={null} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('requiere confirmación explícita', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(
      <ConfirmDialog
        open
        title="Cancelar reserva"
        description="La reserva será cancelada"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('permite volver sin confirmar', async () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(
      <ConfirmDialog
        open
        title="Eliminar alumno"
        description="La operación no se puede deshacer"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
