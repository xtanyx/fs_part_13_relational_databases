const router = require('express').Router()
const {sequelize} = require('../util/db')

const {ReadingList} = require('../models')
const {tokenExtractor, sessionValidator, userEnabled} = require('../util/middleware')

router.post('/', tokenExtractor, userEnabled, sessionValidator, async (req, res) => {
  if (req.decodedToken.id === req.body.userId) {
    const reading = await ReadingList.create(req.body)
    return res.status(201).json(reading)
  }
  else {
    return res.status(403).send({error: 'Cannot add to other\'s reading list'})
  }
  
})

router.put('/:id', tokenExtractor, userEnabled, sessionValidator, async (req, res) => {
  const reading = await ReadingList.findByPk(req.params.id)
  if (reading) {
    if (reading.userId === req.decodedToken.id) {
      reading.read = req.body.read
      const updated_reading = await reading.save()
      res.status(200).json(updated_reading)
    }
    else {
      res.status(401).end()
    }
  }
  else {
    
    res.status(404).end()
  }
})

module.exports = router