import { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })

    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  const handleChange = ({ target }) => {
    setNewBlog({ ...newBlog, [target.name]: target.value })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <TextField
            label="title"
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleChange}
            placeholder="title"
            sx={{ width: 300 }}
          />

          <TextField
            label="author"
            type="text"
            value={newBlog.author}
            name="author"
            onChange={handleChange}
            placeholder="author"
            sx={{ width: 300 }}
          />
          <TextField
            label="url"
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleChange}
            placeholder="url"
            sx={{ width: 300 }}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm