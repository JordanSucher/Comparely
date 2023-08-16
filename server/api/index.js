const router = require('express').Router()
const { models: { User, Company, CompanyComparisonPoint, CompanyDataRaw, Comparison } } = require('../db')
const axios = require('axios')
const { getTweets, getCapterraReviews, getG2Reviews, getArticles, getContent, getPPheaders } = require('./webscraper.js')
const { Configuration, OpenAIApi } = require("openai");
const { Op } = require('sequelize');


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);



router.use('/users', require('./users'))

router.get('/comparisons/:id', async (req, res, next) => {
  const { id } = req.params
  const comparison = await Comparison.findOne({ where: { id } })
  res.json(comparison)
})


router.post('/comparisons', async (req, res, next) => {

  try {

    const regex = /^(?:https?:\/\/)?(?:www\.)?(.*?)\./;
    

    //[google.com, yahoo.com, etc.]
    let companyURLs = req.body.companies
    let emailAddress = req.body.emailAddress

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

    // we send the comparison ID to the frontend at this point, maybe the FE says something like "this is in progress, save this link and come back later"
    res.status(202).json ({"comparisonId": comparison.id})

    // add companies to comparison
    promises = companies.map(async company => {
      await comparison.addCompany(company)
    })

    await Promise.all(promises)

    

    // trigger comparison functions:
      // web scrape a bunch of shit and stick it in the DB
      await webScrape(companies)

      //get perplexity headers / cookies
      // let {PPheaders, PPcookies} = await getPPheaders()
      let PPheaders = {}
      let PPcookies = {}


      
      // hit python server with company IDs. Python server will do analysis w AI and insert rows into DB.
      let companyIds = companies.map(company => company.id)
      await axios.post('http://127.0.0.1:8080/api/py/comparisons', { companyIds: companies, PPheaders: PPheaders, PPcookies: PPcookies})

      // at this point there should be a bunch of relevant data in the company comparison points table

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

      //at this point, send email to user to let them know comparison is ready
      console.log("Completed comparison #" + comparison.id)

      await axios.post("https://api.mailjet.com/v3.1/send", {
          "SandboxMode": false,
          "Messages": [
              {
                  "From": {
                      "Email": "comparebot@altmails.com",
                      "Name": "Comparebot"
                  },
                  "Sender": {
                      "Email": "comparebot@altmails.com",
                      "Name": "Comparebot"
                  },
                  "To": [
                      {
                          "Email": emailAddress,
                          "Name": emailAddress
                      }
                  ],
                  "ReplyTo": {
                      "Email": "comparebot@altmails.com",
                      "Name": "Comparebot"
                  },
                  "Subject": "Your comparison is ready!",
                  "HTMLPart": "<h3>Welcome to <a href=\"https://comparebot2.onrender.com/\">Comparebot!</a></h3><br />Your comparison is ready, click <a href=\"https://comparebot2.onrender.com/comparisons/" + comparison.id + "\">here</a> to view."
              }
          ]
      }, {
        auth : {
          username: process.env.MAILJET_KEY,
          password: process.env.MAILJET_SECRET
        }
      } )

    } catch (err) {
      next(err)
    }

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
  // Get everything ready for the frontend

  // we also want the feature lists to be normalized (have the same feature names)

  let result = {}
  let featuresArray = []
  let swotsArray = []
  let articlesArray = []
  // maybe we want an articlesArray? 

  // get features & swots
  for (let company of companies) {
    try {
      let features = await CompanyComparisonPoint.findAll({
        where: {
          company_id: company.id,
          key: {
            [Op.notIn]: ['feature_list', 'swot']
          }
        }
      })

      let swot = await CompanyComparisonPoint.findAll({
        where: {
          company_id: company.id,
          key: 'swot'
        }
      })

      // at this point we can make an articles array by pulling the articles from the DB
      let articles = await CompanyDataRaw.findAll({
        where: {
          type: 'article',
          company_id: company.id
        }
      })

      articles = articles.map(article => {
        return {summary: JSON.parse(article.text).summary, title: JSON.parse(article.text).title, url: article.url}
      })

      features = features.map(feature => {
        return {key: feature.key, value: feature.value}
      })

      featuresArray.push({'companyId': company.id, 'features': features});
      swotsArray.push({'companyId': company.id, 'swot': swot[0].value});
      articlesArray.push({'companyId': company.id, 'articles': articles});

    } catch (err) {
      console.log(err)
    }


  // eventually also get summary of tweets, summary of reviews here
  }
  // now, we want to normalize the features so they have the same names and structure the SWOTs, can do that w openAI

  let swotsString = JSON.stringify(swotsArray)

  try {
      const chatCompletion2 = await openai.createChatCompletion({
        model: "gpt-4",
        max_tokens: 3500,
        messages: [{role: "user", content: 'Please restructure these SWOTs in this format: [{companyId, SWOT: [{strengths}, {weaknesses}, {opportunities}, {threats}]}].   SWOT object:' + swotsString}],
      });

      let response2 = chatCompletion2.data.choices[0].message.content;
      swotsArray = JSON.parse(response2)


    } catch (err) {
        console.log(err.response.data.error.message)
    }

  // This needs to change so the format of feature and swots is the same
  result = {'features': featuresArray, 'swots': swotsArray, 'articles': articlesArray}
  return result
}


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router
