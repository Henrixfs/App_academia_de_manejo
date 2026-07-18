import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeToggle } from '@/components/providers/theme-toogle'

const themeMocks = vi.hoisted(() => ({
  setTheme: vi.fn(),
  useTheme: vi.fn(),
}))

vi.mock('next-themes', () => ({
  useTheme: themeMocks.useTheme,
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    themeMocks.setTheme.mockReset()
    themeMocks.useTheme.mockReturnValue({ resolvedTheme: 'light', setTheme: themeMocks.setTheme })
  })

  it('cambia al modo oscuro desde el modo claro y expone una etiqueta accesible', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: 'Activar modo oscuro' })
    await user.click(button)

    expect(themeMocks.setTheme).toHaveBeenCalledWith('dark')
  })
})
