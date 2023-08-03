const Sequelize = require("sequelize");
const db = require("../db");

const CompanyComparisonPoint = define("company_comparison_point", {
  key: Sequelize.STRING,
  value: Sequelize.STRING
})

module.exports = CompanyComparisonPoint;
