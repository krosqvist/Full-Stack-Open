const { test, after, beforeEach } = require('node:test')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
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


after(async () => {
  await mongoose.connection.close()
})
