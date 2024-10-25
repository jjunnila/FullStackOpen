const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/test_helper')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are 6 blogs initially', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 6)
  })

  test('the blog identifying field is called id', async () => {
    const response = await api
        .get(`/api/blogs/${helper.initialBlogs[0]._id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert(response.body.hasOwnProperty('id'))
  })

  after(async () => {
    await mongoose.connection.close()
  })