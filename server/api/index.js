const router = require('express').Router()
const { models: { User, Company, CompanyComparisonPoint, CompanyDataRaw, Comparison } } = require('../db')
const axios = require('axios')
const { getTweets, getCapterraReviews, getG2Reviews, getArticles, getContent } = require('./webscraper.js')
const { Configuration, OpenAIApi } = require("openai");
const { Op } = require('sequelize');


const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);



router.use('/users', require('./users'))

router.get('/comparisons/:id', async (req, res, next) => {
  const { id } = req.params
  const comparison = await Comparison.findOne({ where: { id } })
  res.json(comparison)
})


router.post('/comparisons', async (req, res, next) => {
  const regex = /www\.(.*?)\./;
  

  //[google.com, yahoo.com, etc.]
  let companyURLs = req.body.companies

  // upsert companies into companies table
  let promises = companyURLs.map(async company => {
    companyName = company.match(regex)
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

  // create a comparison record
  let comparison = await Comparison.create({
    text: ""
  })

  // add companies to comparison
  promises = companies.map(async company => {
    await comparison.addCompany(company)
  })

  await Promise.all(promises)


  // trigger comparison functions:
    // web scrape a bunch of shit (rn this is just grabbing content from company websites)
    await webScrape(companies)
    
    // hit python server with company IDs. Python server will do analysis w AI and insert rows into DB.
    let companyIds = companies.map(company => company.id)
    await axios.post('http://127.0.0.1:8080/api/comparisons', { companyIds: companies })

    // retrieve data from company_comparison_points table
    let results = await doQueries(companies)

    // add results to comparison table
    await Comparison.update({
      text: JSON.stringify(results)
    }, {
      where: {
        id: comparison.id
      }
    })

    //return success to frontend
    res.json ({"comparisonId": comparison.id})
})


const webScrape = async (companies) => {
  //when provided an array of companies, do a bunch of web scraping


  const promises = companies.map(async company => {


  // grab content from the competitor's website
  return getContent(company)

  
  // // look for tweets
  // return getTweets(company)

  // // get capterra reviews
  // return getCapterraReviews(company)
  
  // // get g2 reviews
  // return getG2Reviews(company)

  // // look for articles on google / crunchbase?
  // return getArticles(company)

})

await Promise.all(promises) //wait until all the above promises are done

console.log("Finished webscraping")
return true
}

const doQueries = async (companies) => {
  //we want the result to be in this format:
  // {features: [{company1}, {company2}],
  //  swots: [{company1}, {company2}]}

  // we also want the feature lists to be normalized (have the same feature names)


  let result = {}
  let featuresArray = []
  let swotsArray = []

  // get features & swots
  for (let company of companies) {
    try {
      let features = await CompanyComparisonPoint.findAll({
        where: {
          company_id: company.id,
          key: 'features'
        }
      })

      let swot = await CompanyComparisonPoint.findAll({
        where: {
          company_id: company.id,
          key: 'swot'
        }
      })

      featuresArray.push({'companyId': company.id, 'features': features[0].value});
      swotsArray.push({'companyId': company.id, 'swot': swot[0].value});

    } catch (err) {
      console.log(err)
    }



  // eventually also get summary of tweets, summary of reviews here
  }

  // now, we want to normalize the features so they have the same names, can do that w openAI

  let featuresString = JSON.stringify(featuresArray)

  try {
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        max_tokens: 3500,
        messages: [{role: "user", content: 'Here is an object that represents the features of N companies. Please return a modified version that standardizes the feature names so that each company has the same features. The goal is to compare these companies apples-to-apples. Please reply in the same format as the provided Array with no other text.    Features Array:' + featuresString}],
      });
      let response = chatCompletion.data.choices[0].message.content;
      featuresArray = JSON.parse(response)
    } catch (err) {
        console.log(err.response.data.error.message)
    }

  result = {'features': featuresArray, 'swots': swotsArray}
  return result
}


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router
