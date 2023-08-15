const Sequelize = require('sequelize');
const db = require('../db');

const Comparison = db.define('comparison', {
    text : {
        type: Sequelize.TEXT
    }
})

module.exports = Comparison