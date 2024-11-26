const router = require('express').Router()
const {Blog, User} = require('../models')
const { Op } = require('sequelize')
const {tokenExtractor, sessionValidator, userEnabled} = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search.toLowerCase()
          }
        },
        {
          author: {
            [Op.substring]: req.query.search.toLowerCase()
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, userEnabled, sessionValidator, async (req, res) => {
  console.log('working...!!')
  const blog = await Blog.create({...req.body, userId: req.decodedToken.id})
  res.status(201).send(blog)
})

router.delete('/:id', tokenExtractor, userEnabled, sessionValidator, blogFinder, async (req, res) => {
  if (req.blog) {
    if (req.blog.userId === req.decodedToken.id) {
      console.log('deleting...')
      await req.blog.destroy()
    }
    else {
      res.status(401).end()
    }
  }
  res.status(204).end()
})

router.put('/:id', tokenExtractor, userEnabled, sessionValidator, blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router