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
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
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

    assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
    
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

test('a blog without a title or a url will result in status code 400', async () => {
    const newBlog = {
        _id: "5a422aa71b54a676234d17ff",
        author: "me",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        likes: 17000000,
        __v: 0
    }
    const newBlog2 = {
        _id: "5a422aa71b54a676234d17ff",
        title: "new blog yippee",
        author: "me",
        likes: 17000000,
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('deletion succeeds with status code 204 if id is valid', async () => {
    const blogToDelete = helper.initialBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    const contents = blogsAtEnd.body.map(r => r.title)

    assert.strictEqual(contents.length, helper.initialBlogs.length - 1)
    assert(!contents.includes(blogToDelete.title))
})

test('deletion fails with status code 400 if id is invalid', async () => {
    await api
      .delete(`/api/blogs/aaaaaaaaaaaaa`)
      .expect(400)
    const blogsAtEnd = await api.get('/api/blogs')
    const contents = blogsAtEnd.body.map(r => r.title)
    assert.strictEqual(contents.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})