import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      console.log('creating a blog with contents', newBlog)
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
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

  const loginForm = () => (
    <div>
      <h1>log in to application</h1>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>   
    </div>   
  )

  const createBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlog.title}
            name="title"
            onChange={({ target }) =>
              setNewBlog({...newBlog, [target.name]: target.value})}
            required
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlog.author}
            name="author"
            onChange={({ target }) =>
              setNewBlog({...newBlog, [target.name]: target.value})}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={({ target }) =>
              setNewBlog({...newBlog, [target.name]: target.value})}
            required
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  const showBlogs = () => (
    <div>
      <h1>blogs</h1>
      <Notification message={message} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {createBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div> 
  )

  return (
    <div>
      {!user && loginForm()}
      {user && showBlogs()}
    </div>
  )
}

export default App