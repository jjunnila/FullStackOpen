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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('dare')
        await page.getByTestId('password').fill('1234')
        await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('e=mc^2')
        await page.getByTestId('author').fill('einstein')
        await page.getByTestId('url').fill('google.com')
        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText('e=mc^2 einstein').first()).toBeVisible()
        await expect(page.locator('.notification')).toContainText('A new blog "e=mc^2" by einstein added')
    })
  })
})