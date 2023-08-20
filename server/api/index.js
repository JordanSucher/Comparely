const router = require("express").Router();

const {
  models: { User, Company, CompanyComparisonPoint, CompanyDataRaw, Comparison },
} = require("../db");

const axios = require("axios");

const {
  getTweets,
  getCapterraReviews,
  getG2Reviews,
  getArticles,
  getContent,
  getPPheaders,
} = require("./webscraper.js");

const { Configuration, OpenAIApi } = require("openai");

const { Op } = require('sequelize');

require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const sseClients = new Map();


router.use("/users", require("./users"));

router.get("/companies/:id", async (req, res, next) => {
  const { id } = req.params;
  const company = await Company.findOne({ where: { id } });
  res.json(company);
})

router.get("/comparisons/:id", async (req, res, next) => {
  const { id } = req.params;
  const comparison = await Comparison.findOne({ where: { id } });
  res.json(comparison);
});


// DATA STREAMING STUFF

router.get("/comparisons/:comparisonId/progress", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  
  // Add this client to the sseClients map
  console.log("Adding SSE client for ID", req.params.comparisonId);
  sseClients.set(String(req.params.comparisonId), res);


  // Handle client disconnect
  req.on("close", () => {
    console.log("Removing SSE client for ID", req.params.comparisonId);
    sseClients.delete(String(req.params.comparisonId));
  });
});


router.post("/receive-data", async (req, res, next) => {
  res.send("Received data");
  console.log ("Received data from python server: ", req.body);

  let data = req.body
  let features = data.features
  let comparisonId = data.comparisonId

  let featureName = data.feature
  let result = data.result 
  let companyId = data.companyId

  if (features && Array.isArray(features)) {
    // it is the feature list

    // update the comparison in the DB
    // create a comparison object placeholder
    let comparisonObj = {
      features: [],
      swots: [],
      articles: [],
    }

    //get companies
    let companies = await Company.findAll({
      include: {
        model: Comparison,
        where: {
          id: comparisonId
        }
      }
    })

    // loop through companies and add placeholder values for features
    companies.forEach((company) => {
      let companyFeatureObj = {
        companyId: company.id,
        features: [],
      }
      features.forEach((feature) => {
        companyFeatureObj.features.push({
          key: feature,
          value: null,
        })
      })
      comparisonObj.features.push(companyFeatureObj);
    })

    await Comparison.update({
      text: JSON.stringify(comparisonObj),
    }, {
      where: {
        id: comparisonId
      }
    })


    let clientRes = sseClients.get(String(comparisonId));
   
      if (clientRes) {
          console.log(`Sending message: ${JSON.stringify(features)} to ID ${comparisonId}`);
          clientRes.write(`data: {"progress": ${JSON.stringify(JSON.stringify(features))}}\n\n`);
        } else {
          console.log(`No client found for ID ${comparisonId}`);
      }
  }

  if (featureName && result) {
    // it is a feature and result
    // update the comparison in the DB

    // first, get comparison
    let comparison = await Comparison.findOne({
      where: {
        id: comparisonId
      }
    })

    let text = comparison.text;
    let comparisonObj = JSON.parse(text)
    let foundFeatureInComparison = false

    // update comparisonObj by adding result
    comparisonObj.features.forEach(feature => {
      if (feature.companyId === companyId) {
        feature.features.forEach(feature => {
          if (feature.key === featureName) {
            feature.value = result
            foundFeatureInComparison = true
          }
        }) 
      }
    })

    // if the feature was not found in the comparison, add it.
    if (!foundFeatureInComparison) {
      comparisonObj.features.forEach(feature => {
        feature.features.push({
          key: featureName,
          value: result
        })
      })
    }

    // update comparison
    await Comparison.update({
      text: JSON.stringify(comparisonObj),
    }, {
      where: {
        id: comparisonId
    }
    })

    // trigger SSE to refresh data
    let clientRes = sseClients.get(String(comparisonId));
   
      if (clientRes) {
          console.log(`Sending message to ID ${comparisonId}`);
          clientRes.write(`data: {"progress": "Received ${featureName} for ${companyId}"}\n\n`);
        } else {
          console.log(`No client found for ID ${comparisonId}`);
      }
  }
})

// END DATA STREAMING STUFF



router.post("/comparisons/features", async (req, res, next) => {
  try {

    // immediately respond so as to not hold anything up
    res.send(true)

    // get vars
    let comparisonId = req.body.comparisonId;
    let featureName = req.body.featureName;
    let companies = req.body.companies

    // update comparison in DB to have featureName
    let comparison = await Comparison.findOne({
      where: {
        id: comparisonId
      }
    })

    let text = comparison.text;
    text = JSON.parse(text)

    text.features.forEach(featureObj => {
      featureObj.features.push({
        key: featureName,
        value: null
      })
    })

    text = JSON.stringify(text)

    await Comparison.update({
      text: text
    }, {
      where: {
        id: comparisonId
      }
    })
  
    //get perplexity headers / cookies
    let { PPheaders, PPcookies } = await getPPheaders();
    

    // pass along to python server

    let result = await axios.post("http://127.0.0.1:8080/api/py/comparisons/features", {
      comparisonId: comparisonId,
      companies: companies,
      PPcookies: PPcookies,
      PPheaders: PPheaders,
      featureName: featureName,
    });

    // python server does the perplexity queries, inserts into the DB, and passes back to receive-data endpoint.
        

  } catch (err) {
    next(err);
  }
})


router.post("/comparisons", async (req, res, next) => {
  try {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(.*?)\./;

    //[google.com, yahoo.com, etc.]
    let companyURLs = req.body.companies;
    let emailAddress = req.body.emailAddress ? req.body.emailAddress : "jsucher@gmail.com";

    // upsert companies into companies table
    let promises = companyURLs.map(async (company) => {
      companyName = company.match(regex);
      if (companyName && companyName[1]) {
        companyName = companyName[1];
      } else {
        companyName = "";
      }

      await Company.upsert({
        url: company,
        name: companyName,
      });
    });

    await Promise.all(promises);

    //grab companies
    let companies = await Company.findAll({
      where: {
        url: {
          [Op.in]: companyURLs,
        },
      },
    });

    let initComparisonObj = {
      features: [],
      swots: [],
      articles: [],
    }

    companies.forEach((company) => {
      initComparisonObj.features.push({
        companyId: company.id,
        features: [],
      })
    })

    // create a comparison record
    let comparison = await Comparison.create({
      text: JSON.stringify(initComparisonObj),
    });

    // we send the comparison ID to the frontend at this point, maybe the FE says something like "this is in progress, save this link and come back later"
    res.status(202).json({ comparisonId: comparison.id });

    // fn for sending server-side events to client
    const sendSSEUpdate = (id, message) => {
      console.log(`Attempting to send SSE message for ID ${id}`);
      
      const clientRes = sseClients.get(String(id));

      
      if (clientRes) {
          console.log(`Sending message: ${JSON.stringify(message)} to ID ${id}`);
          clientRes.write(`data: ${JSON.stringify(message)}\n\n`);
      } else {
          console.log(`No client found for ID ${id}`);
      }
  };

    // add companies to comparison
    promises = companies.map(async (company) => {
      await comparison.addCompany(company);
      return true
    });

    await Promise.all(promises);

    // trigger comparison functions:

    //get perplexity headers / cookies
    let { PPheaders, PPcookies } = await getPPheaders();

    // hit python server with company IDs. Python server will do analysis w AI and insert rows into DB.
    let companyIds = companies.map((company) => company.id);
    await axios.post("http://127.0.0.1:8080/api/py/comparisons", {
      companyIds: companies,
      PPheaders: PPheaders,
      PPcookies: PPcookies,
      comparisonId: comparison.id,
    });


    // web scrape a bunch of shit and stick it in the DB
    await webScrape(companies);
    sendSSEUpdate(comparison.id, { progress: 'Web scraping completed' });

    // at this point there should be a bunch of relevant data in the company comparison points table

    // retrieve data from company_comparison_points table
    let results = await doQueries(companies);

    // add results to comparison table
    await Comparison.update(
      {
        text: JSON.stringify(results),
      },
      {
        where: {
          id: comparison.id,
        },
      }
    );

    //at this point, send email to user to let them know comparison is ready
    console.log("Completed comparison #" + comparison.id);

    await axios.post(
      "https://api.mailjet.com/v3.1/send",
      {
        SandboxMode: false,
        Messages: [
          {
            From: {
              Email: "comparebot@altmails.com",
              Name: "Comparebot",
            },
            Sender: {
              Email: "comparebot@altmails.com",
              Name: "Comparebot",
            },
            To: [
              {
                Email: emailAddress,
                Name: emailAddress,
              },
            ],
            ReplyTo: {
              Email: "comparebot@altmails.com",
              Name: "Comparebot",
            },
            Subject: "Your comparison is ready!",
            HTMLPart:
              '<h3>Welcome to <a href="https://comparebot2.onrender.com/">Comparebot!</a></h3><br />Your comparison is ready, click <a href="https://comparebot2.onrender.com/comparisons/' +
              comparison.id +
              '">here</a> to view.',
          },
        ],
      },
      {
        auth: {
          username: process.env.MAILJET_KEY,
          password: process.env.MAILJET_SECRET,
        },
      }
    );
  } catch (err) {
    next(err);
  }
});

const webScrape = async (companies) => {
  //when provided an array of companies, do a bunch of web scraping

  const promises = companies.map(async (company) => {
    // grab content from the competitor's website
    await getContent(company);

    // // look for tweets
    // return getTweets(company)

    // // get capterra reviews
    // return getCapterraReviews(company)

    // // get g2 reviews
    // return getG2Reviews(company)

    // // look for articles on crunchbase?
    await getArticles(company)

    return true

  });

  await Promise.all(promises).catch(err => console.error("Error in web scraping:", err));

  console.log("Finished webscraping");
  return true;
};

const doQueries = async (companies) => {
  // Get everything ready for the frontend

  // we also want the feature lists to be normalized (have the same feature names)

  let result = {};
  let featuresArray = [];
  let swotsArray = [];
  let articlesArray = [];
  // maybe we want a reviews array?

  // get features & swots
  for (let company of companies) {
    try {
      let features = await CompanyComparisonPoint.findAll({
        where: {
          company_id: company.id,
          key: {
            [Op.notIn]: ["feature_list", "swot"],
          },
        },
      });

      let swot = await CompanyComparisonPoint.findAll({
        where: {
          company_id: company.id,
          key: "swot",
        },
      });

      // at this point we can make an articles array by pulling the articles from the DB
      let articles = await CompanyDataRaw.findAll({
        where: {
          type: "article",
          company_id: company.id,
        },
      });

      articles = articles.map((article) => {
        return {
          summary: JSON.parse(article.text).summary,
          title: JSON.parse(article.text).title,
          url: article.url,
        };
      });

      features = features.map((feature) => {
        return { key: feature.key, value: feature.value };
      });

      featuresArray.push({ companyId: company.id, features: features });
      swotsArray.push({ companyId: company.id, swot: swot[0].value });
      articlesArray.push({ companyId: company.id, articles: articles });
    } catch (err) {
      console.log(err);
    }

    // eventually also get summary of tweets, summary of reviews here
  }
  // now, we want to normalize the features so they have the same names and structure the SWOTs, can do that w openAI

  let swotsString = JSON.stringify(swotsArray);

  async function fetchChatCompletionWithRetry() {
    const maxRetries = 3;
    const retryDelay = 1000; // in milliseconds
    let retryCount = 0;
    let swotsArray;

    while (retryCount < maxRetries) {
      try {
        const chatCompletion2 = await openai.createChatCompletion({
          model: "gpt-4",
          max_tokens: 3500,
          messages: [
            {
              role: "user",
              content:
                "Please restructure these SWOTs in this format: [{companyId, SWOT: [{strengths}, {weaknesses}, {opportunities}, {threats}]}].   SWOT object:" +
                swotsString,
            },
          ],
        });

        let response2 = chatCompletion2.data.choices[0].message.content;
        swotsArray = JSON.parse(response2);

        break; // Exit the loop on success
      } catch (err) {
        retryCount++;
        console.error(`Attempt ${retryCount} failed: ${err.message}`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Delay before retry
      }
    }

    if (retryCount === maxRetries) {
      console.error("Maximum retries reached. Could not fetch SWOTs.");
    }

    return swotsArray;
  }

  // Usage
  fetchChatCompletionWithRetry()
    .then((swotsArray) => {
      console.log("SWOTs successfully retrieved:", swotsArray);
    })
    .catch((error) => {
      console.error("Error while fetching SWOTs:", error);
    });

    
  result = {
    features: featuresArray,
    swots: swotsArray,
    articles: articlesArray,
  };

  return result;
};




router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
