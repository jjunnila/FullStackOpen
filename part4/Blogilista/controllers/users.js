const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const user = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(user)
  })

usersRouter.post('/', async (request, response) => {

    const { username, name, password } = request.body

    if (!(password && password.length >= 3)) {
        return response.status(401).json({
          error: 'invalid password'
        })
      }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
        username,
        name,
        passwordHash,
      })

      const savedUser = await user.save()

      response.status(201).json(savedUser)
})

module.exports = usersRouter