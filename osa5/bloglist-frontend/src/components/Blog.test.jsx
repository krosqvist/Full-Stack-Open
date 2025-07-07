import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title', () => {
  const blog = {
    url: 'testi.com',
    title: 'testiblogi',
    author: 'testaaja',
    user: { username: 'testikäyttäjä' },
    likes: 15
  }

  const user = { username: 'testikäyttäjä' }

  render(
    <Blog
      blog={blog}
      user={user}
    />
  )

  const element = screen.getByText('testiblogi')
  expect(element).toBeDefined()
})

test('clicking the button shows also url, likes and author', async () => {
  const blog = {
    url: 'testi.com',
    title: 'testiblogi',
    author: 'testaaja',
    likes: 15,
    user: { username: 'owner' }
  }

  const user = { username: 'owner' }

  render(
    <Blog
      blog={blog}
      user={user}
    />
  )

  const tester = userEvent.setup()
  const button = screen.getByText('view')
  await tester.click(button)

  expect(screen.getByText('testiblogi')).toBeDefined()
  expect(screen.getByText('testi.com')).toBeDefined()
  expect(screen.getByText('likes 15')).toBeDefined()
  expect(screen.getByText('testaaja')).toBeDefined()
})

test('clicking the like button twice calls the same function', async () => {
  const blog = {
    url: 'testi.com',
    title: 'testiblogi',
    author: 'testaaja',
    likes: 15,
    user: { username: 'owner' }
  }

  const user = { username: 'owner' }
  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={mockHandler}
    />
  )

  const tester = userEvent.setup()
  const button = screen.getByText('view')
  await tester.click(button)

  const like = screen.getByText('like')
  await tester.click(like)
  await tester.click(like)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

