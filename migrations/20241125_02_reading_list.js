const {DataTypes} = require('sequelize')

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.createTable('reading_lists', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {model: 'blogs', key: 'id'}
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {model: 'users', key: 'id'}
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    })
  },
  down: async ({context: queryInterface}) => {
    await queryInterface.dropTable('reading_lists')
  }
}