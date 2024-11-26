const jwt = require('jsonwebtoken')
const {SECRET} = require('../util/config')
const {Session, User} = require('../models')

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error })
  } 
  else if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({error: error.errors.map(e => e.message)})
  }
  else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).send({error})
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }
  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const sessionValidator = async (req, res, next) => {
  const session = await Session.findOne({
    where: {token: req.get('authorization').substring(7)}
  })
  if (!session) {
    return res.status(403).json({error: 'Token expired'})
  }
  next()
}

const userEnabled = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user) {
    return res.status(400).send({
      error: 'wrong token/user does not exist'
    })
  }
  if (user.disabled) {
    return res.status(403).json({
      error: 'account disabled, please contact admin'
    })
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  sessionValidator,
  userEnabled
}