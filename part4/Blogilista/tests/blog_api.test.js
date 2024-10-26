const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/test_helper')
const assert = require('node:assert')

const api = supertest(app)

describe('Blog tests', () => {
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
    
    test('update succeeds with status code 200 if id is valid', async () => {
        const blog = helper.initialBlogs[0]
        const updatedBlog = {...blog, title: "we do a bit of updating"}
        await api 
            .put(`/api/blogs/${blog._id}`)
            .send(updatedBlog)
            .expect(200)
        const blogsAtEnd = await api.get('/api/blogs')
        const contents = blogsAtEnd.body.map(r => r.title)
        assert.strictEqual(contents.length, helper.initialBlogs.length)
        assert(contents.includes(updatedBlog.title))
    })
    
    test('update fails with status code 400 if id is invalid', async () => {
        const blog = helper.initialBlogs[0]
        const updatedBlog = {...blog, title: "we do a bit of updating"}
        await api 
            .put(`/api/blogs/aaaaaaaaaaa`)
            .send(updatedBlog)
            .expect(400)
        const blogsAtEnd = await api.get('/api/blogs')
        const contents = blogsAtEnd.body.map(r => r.title)
        assert.strictEqual(contents.length, helper.initialBlogs.length)
        assert(!contents.includes(updatedBlog.title))
    })
})

describe('User tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(helper.initialUser)
    })
    // username uniqueness, length/exist. password length/exist
    test('valid user can be added', async () => {
        const user = {
            _id: "5a422aa71b54a676234d17f8",
            username: "wareware",
            name: "ware",
            password: "1234",
            __v: 0
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await api.get('/api/users')
        const contents = usersAtEnd.body.map(r => r.username)
        assert.strictEqual(contents.length, 2)
        assert(contents.includes(user.username))
    })

    test('duplicate user cannot be added', async () => {
        const user = {...helper.initialUser, _id: "5a422a851b54a676234d1700"}
        await api
            .post('/api/users')
            .send(user)
            .expect(401)
        const usersAtEnd = await api.get('/api/users')
        const contents = usersAtEnd.body.map(r => r.username)
        assert.strictEqual(contents.length, 1)
    })

    test('too short username cannot be added', async () => {
        const user = {...helper.initialUser, _id: "5a422a851b54a676234d1700", username: "aa"}
        await api
            .post('/api/users')
            .send(user)
            .expect(401)
        const usersAtEnd = await api.get('/api/users')
        const contents = usersAtEnd.body.map(r => r.username)
        assert.strictEqual(contents.length, 1)
    })

    test('nonexisting username cannot be added', async () => {
        const user = {
            _id: "5a422aa71b54a676234d17f8",
            name: "ware",
            password: "1234",
            __v: 0
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
        const usersAtEnd = await api.get('/api/users')
        const contents = usersAtEnd.body.map(r => r.username)
        assert.strictEqual(contents.length, 1)
    })

    test('too short password cannot be added', async () => {
        const user = {
            _id: "5a422aa71b54a676234d17f8",
            username: "wareware",
            name: "ware",
            password: "12",
            __v: 0
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(401)
        const usersAtEnd = await api.get('/api/users')
        const contents = usersAtEnd.body.map(r => r.username)
        assert.strictEqual(contents.length, 1)
    })

    test('nonexisting password cannot be added', async () => {
        const user = {
            _id: "5a422aa71b54a676234d17f8",
            username: "wareware",
            name: "ware",
            __v: 0
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(401)
        const usersAtEnd = await api.get('/api/users')
        const contents = usersAtEnd.body.map(r => r.username)
        assert.strictEqual(contents.length, 1)
    })
})


after(async () => {
    await mongoose.connection.close()
})