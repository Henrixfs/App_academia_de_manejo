import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'


test('landing y login son navegables y accesibles', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const landingResults = await new AxeBuilder({ page }).analyze()
  expect(landingResults.violations).toEqual([])

  await page.goto('/login')
  await expect(page.getByLabel(/documento o email/i)).toHaveAttribute('autocomplete', 'username')
  await expect(page.getByRole('textbox', { name: 'Contraseña', exact: true })).toHaveAttribute('autocomplete', 'current-password')
  const loginResults = await new AxeBuilder({ page }).analyze()
  expect(loginResults.violations).toEqual([])
})
