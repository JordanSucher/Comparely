const router = require('express').Router()
// const { getTweets, getCapterraReviews, getG2Reviews, getArticles, getContent } = require('./webscraper.js')

router.use('/users', require('./users'))

router.post('/comparisons', async (req, res, next) => {
  

  //[google.com, yahoo.com, etc.]
  let companyURLs = req.body.companies

  // upsert companies into companies table
  // how do we get company name?
  let companies = await companies.bulkCreate(companyURLs)


  // trigger comparison functions:
    // web scrape a bunch of shit - Eric
    await webScrape(companies)
    
    // trigger config of llama index based on that shit - Hunter
    let index = await setUpLlamaIndex(companies)

    // do a bunch of queries
    let results = await doQueries(index)

    //return stuff to frontend
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

const doQueries = async (index) => {
  // some prompt engineering bullshit here

  index.query("Make a comprehensive list of features that is a superset of all competitors")
}


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router
