const router = require('express').Router()
const {User, Blog, ReadingList} = require('../models')
const {tokenExtractor, sessionValidator, userEnabled} = require('../util/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    ]
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let where = {}
  if (req.query.read) {
    where = {
      read: req.query.read
    }
  }
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
        through: {
          attributes: []
        },
        include: {
          model: ReadingList,
          attributes: {exclude: ['userId', 'blogId']},
          where
        }
      }
    ]
  })
  if (user) {
    res.json(user)
  }
  else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', tokenExtractor, userEnabled, sessionValidator, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  
  if (user) {
    if (user.username === req.decodedToken.username) {
      user.username = req.body.username
      const updatedUser = await user.save()
      res.json(updatedUser)
    }
    else {
      return res.status(403).send({error: 'No access. Cannot change other\'s username'})
    }
  } else {
    res.status(404).end()
  }
})

module.exports = router