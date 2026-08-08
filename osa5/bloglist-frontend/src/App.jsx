import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, Navigate, useNavigate
} from 'react-router-dom'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/Login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

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
      navigate('/')
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
        navigate('/')
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
      setBlogs(blogs.map(b => b.id !== likedBlog.id ? b: { ...likedBlog, user: b.user }))
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

  return (
    <div>
      <Notification message={message} />

      <div>
        <Link to="/">blogs</Link>{' '}
        {user && (<><Link to="/create">new blog</Link>{' '}</>)}
        {!user && (<Link to="/login">login</Link>)}
        {user && (<button onClick={handleLogout}>logout</button>)}
      </div>

      <Routes>
        <Route path="/login" element={
          user ? (
            <Navigate replace to="/" />
          ) : (
            loginForm()
          )
        }
        />

        <Route path="/" element={
          <BlogList
            blogs={blogs}
            user={user}
            handleLogout={handleLogout}
          />
        }
        />

        <Route path="/blogs/:id" element={
          <Blog
            blogs={blogs}
            user={user}
            handleLike={handleLike}
            handleDeleteBlog={handleDeleteBlog}
          />
        }
        />

        <Route path="/create" element={
          !user ? (
            <Navigate replace to ="/" />
          ) : (
            <BlogForm
              createBlog={handleCreateBlog}
            />
          )
        }
        />
      </Routes>
    </div>
  )
}

export default App