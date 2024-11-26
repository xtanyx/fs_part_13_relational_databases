const {Model, DataTypes} = require('sequelize')

const {sequelize} = require('../util/db')

class Blog extends Model {}

const date = new Date()

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false 
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1991,
      max: date.getFullYear()
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
})

module.exports = Blog