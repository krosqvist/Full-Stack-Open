import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDeleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isBlogOwner = user.username === blog.user?.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.author}</div>
          {isBlogOwner && (
            <button onClick={() => handleDeleteBlog(blog)}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}


export default Blog
