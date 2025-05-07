import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/Login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    console.log('logging out from account', user.username)
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      blogService.setToken(null)
    } catch (exception) {
      setMessage('Error logging out')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      console.log('creating a blog with contents', blogObject)
      const createdBlog = await blogService.create(blogObject)
      createdBlog.user = user
      setBlogs(blogs.concat(createdBlog))
      setMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Error creating blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleDeleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`))
      try {
        console.log('deleting blog', blogObject)
        await blogService.remove(blogObject.id)
        setBlogs(blogs.filter(b => b.id !== blogObject.id))
        setMessage(`Deleted blog ${blogObject.title} by ${blogObject.author}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } catch (exception) {
        setMessage('Error deleting blog')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
  }

  const handleLike = async (blogObject) => {
    try {
      console.log('adding a like to blog', blogObject)
      const likedBlog = await blogService.addLike({
        ...blogObject,
        likes: blogObject.likes + 1 })
      setBlogs(blogs.map(b => b.id !== likedBlog.id ? b: likedBlog))
      setMessage(`a new blog ${likedBlog.title} by ${likedBlog.author} was liked`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Error liking blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <LoginForm
      handleLogin={handleLogin}
      setUsername={({ target }) => setUsername(target.value)}
      setPassword={({ target }) => setPassword(target.value)}
      message={message}
      username={username}
      password={password}
    />
  )

  const showBlogs = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return (
      <div>
        <h1>blogs</h1>
        <Notification message={message} />
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel='create new' ref={blogFormRef}>
          <BlogForm createBlog={handleCreateBlog}/>
        </Togglable>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDeleteBlog={handleDeleteBlog}
            user={user} />
        )}
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && showBlogs()}
    </div>
  )
}

export default App