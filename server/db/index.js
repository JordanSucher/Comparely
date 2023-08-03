//this is the access point for all things database related!

const { Sequelize } = require('sequelize')
const db = require('./db')

const User = require('./models/User')
const Company = require('./models/Company');
const CompanyComparisonPoint = require('./models/CompanyComparisonPoint')
const CompanyDataRaw = require('./models/CompanyDataRaw')

// associations go here!
Company.hasMany(CompanyComparisonPoint, {foreignKey: 'company_id'});
Company.hasMany(CompanyDataRaw, {foreignKey: 'company_id'});

CompanyDataRaw.belongsTo(Company, {foreignKey: 'company_id'})
CompanyComparisonPoint.belongsTo(Company, {foreignKey: 'company_id'})

module.exports = {
  db,
  models: {
    User,
    Company,
    CompanyComparisonPoint,
    CompanyDataRaw
  },
}

