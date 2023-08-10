const Sequelize = require("sequelize");
const db = require("../db");

const Company = db.define("company", {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true,
    },
  },
  vector_table: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

module.exports = Company;
