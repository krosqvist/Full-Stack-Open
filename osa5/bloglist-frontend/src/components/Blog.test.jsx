import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('blog info is shown correctly for logged in user that is not the creator', () => {
  const blog = {
    url: 'testi.com',
    title: 'testiblogi',
    author: 'testaaja',
    user: { username: 'testikäyttäjä' },
    likes: 15
  }

  const user = { username: 'testaaja' }

  render(
    <Blog
      blog={blog}
      user={user}
    />
  )

  expect(screen.getByText('testiblogi')).toBeDefined()
  expect(screen.getByText('testi.com')).toBeDefined()
  expect(screen.getByText('likes 15')).toBeDefined()
  expect(screen.getByText('By: testaaja')).toBeDefined()
  expect(screen.queryByText('like')).toBeInTheDocument()
  expect(screen.queryByText('delete')).not.toBeInTheDocument()
})

test('blog info is shown correctly for logged in user that is the creator', () => {
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

  expect(screen.getByText('testiblogi')).toBeDefined()
  expect(screen.getByText('testi.com')).toBeDefined()
  expect(screen.getByText('likes 15')).toBeDefined()
  expect(screen.getByText('By: testaaja')).toBeDefined()
  expect(screen.queryByText('like')).toBeInTheDocument()
  expect(screen.queryByText('delete')).toBeInTheDocument()
})

test('blog info is rendered correctly for user not logged in', () => {
  const blog = {
    url: 'testi.com',
    title: 'testiblogi',
    author: 'testaaja',
    user: { username: 'testikäyttäjä' },
    likes: 15
  }

  render(
    <Blog
      blog={blog}
    />
  )

  expect(screen.getByText('testiblogi')).toBeDefined()
  expect(screen.getByText('testi.com')).toBeDefined()
  expect(screen.getByText('likes 15')).toBeDefined()
  expect(screen.getByText('By: testaaja')).toBeDefined()
  expect(screen.queryByText('like')).not.toBeInTheDocument()
  expect(screen.queryByText('delete')).not.toBeInTheDocument()
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
  const button = screen.getByText(blog.title)
  await tester.click(button)

  expect(screen.getByText('testiblogi')).toBeDefined()
  expect(screen.getByText('testi.com')).toBeDefined()
  expect(screen.getByText('likes 15')).toBeDefined()
  expect(screen.getByText('By: testaaja')).toBeDefined()
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
  const button = screen.getByText(blog.title)
  await tester.click(button)

  const like = screen.getByText('like')
  await tester.click(like)
  await tester.click(like)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

