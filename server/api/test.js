const { Configuration, OpenAIApi } = require("openai");
const { models: { User, Company, CompanyComparisonPoint, CompanyDataRaw, Comparison } } = require('../db')
const fs = require('fs')


const configuration = new Configuration({
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);

let companies = [{id: 1}, {id: 2}]

  
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
fs.writeFileSync('featureString.json', featuresString)

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
console.log(result)
fs.writeFileSync('result.json', JSON.stringify(result))
return result
}


doQueries(companies)