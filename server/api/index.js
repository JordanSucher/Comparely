const router = require('express').Router()

router.use('/users', require('./users'))

router.post('/comparisons', async (req, res, next) => {
  
  let companyURLs = req.body.companies
  // upsert companies into companies table

  // make a companies variable
  let companies = something


  // trigger comparison functions:
    // web scrape a bunch of shit - Eric
    await webScrape()
    
    // trigger config of llama index based on that shit - Hunter
    let index = await setUpLlamaIndex(companies)

    // do a bunch of queries
    await doQueries(index)
})


const webScrape = async () => {
  //do a bunch of web scraping
  //dont return anything until ur done
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
