const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

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

const initialUsers = async () => {
  const password1 = await bcrypt.hash('salasana', 10)
  const password2 = await bcrypt.hash('salasana', 10)

  return [
    {
      username: 'testikäyttäjä',
      name: 'testaaja',
      passwordHash: password1
    },
    {
      username: 'kimbo',
      name: 'kim',
      passwordHash: password2
    }
  ]
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, blogsInDb
}