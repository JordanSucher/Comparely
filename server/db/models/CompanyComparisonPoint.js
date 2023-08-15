const Sequelize = require("sequelize");
const db = require("../db");

const CompanyComparisonPoint = db.define("company_comparison_point", {
  key: Sequelize.STRING,
  value: Sequelize.TEXT
})

module.exports = CompanyComparisonPoint;
