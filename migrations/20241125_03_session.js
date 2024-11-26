const {DataTypes} = require('sequelize')

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    })
    await queryInterface.createTable('sessions', {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      }
    })
  },
  down: async ({context: queryInterface}) => {
    await queryInterface.removeColumn('users', 'disabled')
    await queryInterface.dropTable('sessions')
  }
}