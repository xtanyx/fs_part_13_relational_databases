const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const {User, Session} = require('../models')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const session = await Session.findOne({
    where: {userId: user.id}
  })

  if (session) {
    return response.status(400).send({error: 'Already logged in!'})
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  await Session.create({token: token, userId: user.id})

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router