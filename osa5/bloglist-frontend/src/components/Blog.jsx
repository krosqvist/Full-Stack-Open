import { useParams } from 'react-router-dom'

const Blog = ({ blogs, user, handleLike, handleDeleteBlog }) => {
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  const isBlogOwner = user?.username === blog.user?.username

  return (
    <div className='blog'>
      <h2>{blog.title}</h2>
      <p>{blog.url}</p>
      <p>
        likes {blog.likes}
        {user && (<button onClick={() => handleLike(blog)}>like</button>)}
      </p>
      <p>{blog.author}</p>
      {isBlogOwner && (<button onClick={() => handleDeleteBlog(blog)}>
        delete
      </button>)}
    </div>
  )
}

export default Blog
