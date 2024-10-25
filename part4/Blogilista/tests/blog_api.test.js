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

test('adding a blog works', async () => {
    const newBlog = {
            _id: "5a422aa71b54a676234d17ff",
            title: "new blog yippee",
            author: "me",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            likes: 17000000,
            __v: 0
        }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, 7)
    
    assert(contents.includes('new blog yippee'))
})

test('a blog with a null like counter is assigned a 0 value', async () => {
    const newBlog = {
        _id: "5a422aa71b54a676234d17ff",
        title: "new blog yippee",
        author: "me",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs/5a422aa71b54a676234d17ff')

    assert.strictEqual(response.body.likes, 0)
})

after(async () => {
    await mongoose.connection.close()
})