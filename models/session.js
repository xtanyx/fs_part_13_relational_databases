const {DataTypes, Model} = require('sequelize')

const {sequelize} = require('../util/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    // references: {model: 'users', key: 'id'}
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session'
})

module.exports = Session