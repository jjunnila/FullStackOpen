const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

  if (!request.body.title || !request.body.url)
    response.status(400).end()
  else {

    if (!request.body.likes)
      request.body.likes = 0

    request.body.user = request.user._id

    const blog = new Blog(request.body)
    const savedBlog = await blog.save()

    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const blog = await Blog.findById(request.params.id)

  /* console.log(blog.user.toString());
  console.log(request.user._id.toString()); */

  if(!blog)
    return response.status(400).json({ error: 'item not found' })

  if (!(blog.user.toString() === request.user._id.toString()))
    return response.status(401).json({ error: 'can delete only own items' })

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
      _id: body.id,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      __v: 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter