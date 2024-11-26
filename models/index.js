const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_lists')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, {through: ReadingList, as: 'readings'})
Blog.belongsToMany(User, {through: ReadingList})
User.hasMany(ReadingList)
ReadingList.belongsTo(User)
Blog.hasMany(ReadingList)
ReadingList.belongsTo(Blog)

// User.hasMany(Session)
// Session.belongsTo(User)

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
}