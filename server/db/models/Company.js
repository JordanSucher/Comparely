const Sequelize = require("sequelize");
const db = require("../db");

const Company = db.define("company", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
});

module.exports = Company;
