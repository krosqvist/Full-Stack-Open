const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const users = await helper.initialUsers()

  for (const user of users) {
    const userObject = new User(user)
    await userObject.save()
  }
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('incorrect username can not be entered', async () => {
  const newUser = {
    username: 'aa',
    name: 'testi',
    password: 'salasana'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('incorrect password can not be entered', async () => {
  const newUser = {
    username: 'testikäyttäjä',
    name: 'testi',
    password: 'aa'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('correct amount of blogs is returned as JSON', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('identification field is called id', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
  response.body.forEach((blog) => {
    assert.ok(blog.id, `id is not defined correctly for ${blog.title}`)
  })
})

test('a valid blog can be added', async () => {
  const login = await api
    .post('/api/login')
    .send({
      username: 'kimbo',
      password: 'salasana'
    })

  const token = login.body.token

  const newBlog = {
    title: 'testiblogi3',
    author: 'kimbo',
    url: 'å.com',
    likes: 55
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(titles.includes('testiblogi3'))
})

test('a blog without token can not be added', async () => {
  const newBlog = {
    title: 'testiblogi3',
    author: 'kimbo',
    url: 'å.com',
    likes: 55
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('if likes is empty, the default value is 0', async () => {
  const login = await api
    .post('/api/login')
    .send({
      username: 'kimbo',
      password: 'salasana'
    })

  const token = login.body.token
  const newBlog = {
    title: 'testiblogi4',
    author: 'kimbo',
    url: 'å.com'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body[helper.initialBlogs.length]
  assert.strictEqual(addedBlog.likes, 0)
})

test('if title or url are empty return 400', async () => {
  const login = await api
    .post('/api/login')
    .send({
      username: 'kimbo',
      password: 'salasana'
    })

  const token = login.body.token
  const newBlog = {
    author: 'kimbo',
    likes: 44
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const login = await api
    .post('/api/login')
    .send({
      username: 'kimbo',
      password: 'salasana'
    })
  const token = login.body.token

  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

// Requires all the fields to be entered, even though they remained the same
test('a blog can be modified', async () => {
  const login = await api
    .post('/api/login')
    .send({
      username: 'kimbo',
      password: 'salasana'
    })
  const token = login.body.token

  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    title: 'päivitys',
    author: 'kimbo2',
    url: 'eeee',
    likes: 999
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.title, updatedData.title)
  assert.strictEqual(response.body.likes, updatedData.likes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.title, updatedData.title)
  assert.strictEqual(updatedBlog.likes, updatedData.likes)
})



after(async () => {
  await mongoose.connection.close()
})


