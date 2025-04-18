const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'testiblogi1',
    author: 'kimbo',
    url: 'ö.com',
    likes: 77
  },
  {
    title: 'testiblogi2',
    author: 'kimbo',
    url: 'ä.com',
    likes: 88
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}