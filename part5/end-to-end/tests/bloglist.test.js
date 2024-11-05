const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'dare',
        username: 'dare',
        password: '1234'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to the application')).toBeVisible()
    await expect(page.getByText('Blogs')).not.toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('username').fill('dare')
        await page.getByTestId('password').fill('1234')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.locator('.notification')).toContainText('Logged in as dare')
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('dare')
        await page.getByTestId('password').fill('4321')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.locator('.error')).toContainText('Wrong username or password')
    })
  })
})