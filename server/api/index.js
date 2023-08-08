const router = require('express').Router()
const { models: { User, Company, CompanyComparisonPoint, CompanyDataRaw } } = require('../db')
const axios = require('axios')
const { getTweets, getCapterraReviews, getG2Reviews, getArticles, getContent } = require('./webscraper.js')

router.use('/users', require('./users'))

router.post('/comparisons', async (req, res, next) => {
  const regex = /www\.(.*?)\./;
  

  //[google.com, yahoo.com, etc.]
  let companyURLs = req.body.companies

  // upsert companies into companies table
  let promises = companyURLs.map(async company => {
    companyName = url.match(regex)
    if (companyName && companyName[1]) {
      companyName = companyName[1]
    } else {
      companyName = ""
    }

    await Company.upsert({
      url: company,
      name: companyName
    })
  })

  await Promise.all(promises)
  
  //grab companies
  let companies = await Company.findAll({
    where: {
      url: {
        [Op.in]: companyURLs
      }
    }
  })


  // trigger comparison functions:
    // web scrape a bunch of shit - Eric
    await webScrape(companies)
    
    // hit python server with company IDs. Python server will do analysis w AI and insert rows into DB.
    let companyIds = companies.map(company => company.id)
    await axios.post('http://127.0.0.1:8080/api/comparisons', { companyIds: companies })

    // retrieve data from company_comparison_points table
    let results = await doQueries(companies)

    //return results to frontend
    res.json (results)
})


const webScrape = async (companies) => {
  //when provided an array of companies, do a bunch of web scraping


const promises = companies.forEach(async company => {
  // look for tweets
  await getTweets(company)

  // get capterra reviews
  await getCapterraReviews(company)
  
  // get g2 reviews
  await getG2Reviews(company)

  // look for articles on google / crunchbase?
  await getArticles(company)

  // grab content from the competitor's website
  await getContent(company)

})

await Promise.all(promises) //wait until all the above promises are done

// what inserting into companyData might look like

  // CompanyData.create({
  //   companyId: someVariable,
  //   pageTitle: "test",
  //   url: "test",
  //   text: "test",
  //   type: "test"
  // })
  
}

const setUpLlamaIndex = async (companies) => {
  // this function is gonna need to know which documents are relevant for a given comparison

  let documents = await CompanyDataRaw.findAll({
    where: {
      companyId: {
        [Op.in]: companies
      }
    }
  })

  let index = createLlamaVectorIndexBullshit(documents)
  return index 

}

const doQueries = async (companies) => {
  let result = {}

  for (let company of companies) {
    // get features
    let features = await CompanyComparisonPoint.findAll({
      where: {
        companyId: company.id,
        key: 'features'
      }
    })

    let swot = await CompanyComparisonPoint.findAll({
      where: {
        companyId: company.id,
        key: 'swot'
      }
    })

    result[company.id] = {
      features: features,
      swot: swot
    }

  }

  return result
}


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router
