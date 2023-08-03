const Sequelize = require('sequelize');
const db = require('../db');

const CompanyDataRaw = db.define("company_data_raw", {
  pageTitle: Sequelize.STRING,
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  text: Sequelize.STRING,
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  type: Sequelize.STRING
})

module.exports = CompanyDataRaw;
