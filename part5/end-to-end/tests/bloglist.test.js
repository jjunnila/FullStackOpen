const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, create } = require('./helper')

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
    await request.post('/api/users', {
      data: {
        name: 'ware',
        username: 'ware',
        password: '12345'
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
        await login(page, 'dare', '1234')
    })
  
    test('a new blog can be created', async ({ page }) => {
        await create(page, 'e=mc^2', 'einstein', 'google.com')
        await expect(page.getByText('e=mc^2 einstein').first()).toBeVisible()
        await expect(page.locator('.notification')).toContainText('A new blog "e=mc^2" by einstein added')
    })

    test('a blog can be liked', async ({ page }) => {
        await create(page, 'e=mc^2', 'einstein', 'google.com')
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog made by the user can be deleted', async ({ page }) => {
      await create(page, 'e=mc^2', 'einstein', 'google.com')
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('e=mc^2 einstein').last()).not.toBeVisible()
    })

    test('a user can only see remove button on own blogs', async ({ page }) => {
      await create(page, 'e=mc^2', 'einstein', 'google.com')
      await page.getByRole('button', { name: 'log out' }).click()
      await login(page, 'ware', '12345')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('multiple blogs are sorted according to like count', async ({ page }) => {

      await create(page, 'e=mc^2', 'einstein', 'google.com')
      await create(page, 'f=ma', 'newton', 'bing.com')
      await create(page, 'e^ipi=-1', 'euler', 'wikipedia.com')

      await page.getByText('e=mc^2').getByRole('button', { name: 'view' }).click()
      await page.getByText('f=ma').getByRole('button', { name: 'view' }).click()
      await page.getByText('e^ipi=-1').getByRole('button', { name: 'view' }).click()

      await page.getByText('e=mc^2').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('e=mc^2').last()).toContainText('likes 1')

      await page.getByText('f=ma').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('f=ma').last()).toContainText('likes 1')
      await page.getByText('f=ma').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('f=ma').last()).toContainText('likes 2')

      await page.getByText('e^ipi=-1').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('e^ipi=-1').last()).toContainText('likes 1')
      await page.getByText('e^ipi=-1').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('e^ipi=-1').last()).toContainText('likes 2')
      await page.getByText('e^ipi=-1').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('e^ipi=-1').last()).toContainText('likes 3')
      
      await expect(page.getByText('likes').first()).toContainText('likes 3')
      await expect(page.getByText('likes').last()).toContainText('likes 1')
    })
  })
})