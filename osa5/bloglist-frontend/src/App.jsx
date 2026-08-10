import { useState, useEffect } from 'react'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import {
  Routes, Route, Link, Navigate, useNavigate, useMatch
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
  const [notification, setNotification] = useState(null)
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
      setNotification({ text: 'Wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
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
      setNotification({ text: 'Error logging out', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      console.log('creating a blog with contents', blogObject)
      const createdBlog = await blogService.create(blogObject)
      createdBlog.user = user
      setBlogs(blogs.concat(createdBlog))
      setNotification({ text: `a new blog ${createdBlog.title} by ${createdBlog.author} added`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      navigate('/')
    } catch (exception) {
      setNotification({ text: 'Error creating blog', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleDeleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`))
      try {
        console.log('deleting blog', blogObject)
        await blogService.remove(blogObject.id)
        setBlogs(blogs.filter(b => b.id !== blogObject.id))
        setNotification({ text: `Deleted blog ${blogObject.title} by ${blogObject.author}`, type: 'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        navigate('/')
      } catch (exception) {
        setNotification({ text: 'Error deleting blog', type: 'error' })
        setTimeout(() => {
          setNotification(null)
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
      setNotification({ text: `a new blog ${likedBlog.title} by ${likedBlog.author} was liked`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification({ text: 'Error liking blog', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const loginForm = () => (
    <LoginForm
      handleLogin={handleLogin}
      setUsername={({ target }) => setUsername(target.value)}
      setPassword={({ target }) => setPassword(target.value)}
      username={username}
      password={password}
    />
  )

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>blogs</Button>
          {user && (<Button color="inherit" component={Link} to="/create" sx={hoverStyle}>new blog</Button>)}
          {!user && (<Button color="inherit" component={Link} to="/login" sx={hoverStyle}>login</Button>)}
          {user && (<Button color="inherit" onClick={handleLogout} sx={hoverStyle}>logout</Button>)}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

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
            blog={blog}
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
    </Container>
  )
}

export default App