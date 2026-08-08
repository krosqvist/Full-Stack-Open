import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testikäyttäjä',
        username: 'testaaja',
        password: 'salasana'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('blogs')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'create new' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'väärä')

      const messageDiv = page.locator('.message')
      await expect(messageDiv).toContainText('Wrong username or password')
      await expect(messageDiv).toHaveCSS('border-style', 'solid')
      await expect(messageDiv).toHaveCSS('background-color', 'rgb(211, 211, 211)')
    })

    test.describe('When logged in', () => {
      test.beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {
        const title = 'Ensimmäinen testiblogi'
        const author = 'Matti Luukkainen'
        const url = 'testi.com'

        await createBlog(page, title, author, url)

        const messageDiv = page.locator('.message')
        await expect(messageDiv).toContainText(`a new blog ${title} by ${author} added`)
        await expect(messageDiv).toHaveCSS('border-style', 'solid')
        await expect(messageDiv).toHaveCSS('background-color', 'rgb(211, 211, 211)')

        await expect(page.getByText(title).last()).toBeVisible()
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText(title).last()).toBeVisible()
        await expect(page.getByRole('button', { name: 'hide' })).toBeVisible()
        await expect(page.getByText(url)).toBeVisible()
        await expect(page.getByText('likes 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await expect(page.getByText(author).last()).toBeVisible()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        const title = 'Ensimmäinen testiblogi'
        const author = 'Matti Luukkainen'
        const url = 'testi.com'

        await createBlog(page, title, author, url)

        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        const title = 'Ensimmäinen testiblogi'
        const author = 'Matti Luukkainen'
        const url = 'testi.com'

        await createBlog(page, title, author, url)
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'delete' }).click()

        const messageDiv = page.locator('.message')
        await expect(messageDiv).toContainText(`Deleted blog ${title} by ${author}`)
        await expect(messageDiv).toHaveCSS('border-style', 'solid')
        await expect(messageDiv).toHaveCSS('background-color', 'rgb(211, 211, 211)')
        await expect(page.getByRole('button', { name: 'view' })).not.toBeVisible()
      })

      test('only user who created the blog can delete it', async ({ page }) => {
        const title = 'Ensimmäinen testiblogi'
        const author = 'Matti Luukkainen'
        const url = 'testi.com'

        await createBlog(page, title, author, url)
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'testaaja', 'salasana')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })

      test('blogs are ordered by likes in descending order', async ({ page }) => {
        await createBlog(page, 'A', 'A', 'A')
        await createBlog(page, 'B', 'B', 'B')
        await createBlog(page, 'C', 'C', 'C')

        const blogA = page.locator('.blog').filter({ hasText: 'A' })
        const blogB = page.locator('.blog').filter({ hasText: 'B' })
        const blogC = page.locator('.blog').filter({ hasText: 'C' })

        await blogA.getByRole('button', { name: 'view' }).click()
        await blogB.getByRole('button', { name: 'view' }).click()
        await blogC.getByRole('button', { name: 'view' }).click()

        await blogA.getByRole('button', { name: 'like' }).click()
        await expect(blogA).toContainText('likes 1')

        await blogB.getByRole('button', { name: 'like' }).click()
        await expect(blogB).toContainText('likes 1')
        await blogB.getByRole('button', { name: 'like' }).click()
        await expect(blogB).toContainText('likes 2')

        await blogC.getByRole('button', { name: 'like' }).click()
        await expect(blogC).toContainText('likes 1')
        await blogC.getByRole('button', { name: 'like' }).click()
        await expect(blogC).toContainText('likes 2')
        await blogC.getByRole('button', { name: 'like' }).click()
        await expect(blogC).toContainText('likes 3')

        const blogs = page.locator('.blog')

        await expect(blogs.nth(0)).toContainText('C')
        await expect(blogs.nth(1)).toContainText('B')
        await expect(blogs.nth(2)).toContainText('A')
      })
    })
  })
})