import { useState } from 'react'
import PropTypes from 'prop-types'

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
        <div>
          title:
          <input
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlog.author}
            name="author"
            onChange={handleChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm