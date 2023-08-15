const Sequelize = require('sequelize');
const db = require('../db');

const CompanyDataRaw = db.define("company_data_raw", {
  pageTitle: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT
  },
  date: {
    type: Sequelize.DATE,
  },
  type: {
    type: Sequelize.STRING
  }
})

module.exports = CompanyDataRaw;
