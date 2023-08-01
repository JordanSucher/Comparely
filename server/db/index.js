//this is the access point for all things database related!

const { Sequelize } = require('sequelize')
const db = require('./db')

const User = require('./models/User')

// associations go here!


module.exports = {
  db,
  models: {
    User,
  },
}

