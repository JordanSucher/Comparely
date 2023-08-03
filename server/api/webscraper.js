const axios = require('axios')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const fs = require('fs')
const { models: CompanyData } = require('../db')
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: 
});

const openai = new OpenAIApi(configuration);



const stripMetadataAndFormatting = (text) => {
    // Remove JSON and metadata-like structures
    text = text.replace(/\{[^}]*\}/g, '');
  
    // Remove URLs
    text = text.replace(/http\S+|www\S+/g, '');
  
    // Remove image URLs
    text = text.replace(/\burl\s*:\s*"(.*?)"/g, '');
  
    // Remove HTML tags
    text = text.replace(/<.*?>/g, '');
  
    // Remove extra spaces and line breaks
    text = text.replace(/\s+/g, ' ');
  
    // Remove leading and trailing spaces
    text = text.trim();
  
    return text;
  }



  const cleanUpTextWithOpenAI = async (text) => {

    let input = text
    input = stripMetadataAndFormatting(text)
    

    try {
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        max_tokens: 4500,
        messages: [{role: "user", content: "Strip out the unnecessary characters and reply with the full article and no other text.     Article:" + input}],
      });
      return chatCompletion.data.choices[0].message.content;
    } catch (err) {
        console.log(err.response.data.error.message)
    }
      
}



const getTweets = (company) => {


}

const getCapterraReviews = (company) => {

}

const getG2Reviews = (company) => {

}

const getArticles = async (company) => {
    //get articles from crunchbase. 
    
    //identify the crunchbase URL for the company
    let result = await axios.get("https://www.google.com/search?q=" + company.url + " crunchbase")
    let $ = cheerio.load(result.data)
    let links = []
    $("a").each((index, element) => {
        links.push(element.attribs.href)
    })
    links = links.filter(link => link.includes("crunchbase.com"))

    let crunchbaseUrl = links[0].split('?q=')[1].split('&')[0] + "/signals_and_news/timeline"


    //get the article links

    links = []

    try {
        result = await axios.get(crunchbaseUrl,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.google.com'
            }
        })
    } catch (err) {
        console.log(err)
    }

    $ = cheerio.load(result.data)

    $(".activity-url-title").each((index, element) => {
        links.push(element.attribs.href)
        //placeholder - at this point we can upsert the articles into the company_data_raw table and then identify which articles we haven't scraped yet

    })

    //now we have the news links, we can get the articles.


    const promises = links.map(async link => {
        //for each link, go to the page and grab the whole body and title and stick in DB
        try {
            let result = await axios.get(link,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Referer': 'https://www.google.com'
                }
            })
            $ = cheerio.load(result.data)
            let text = $("body").text()

            //add a 10s delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            text = await cleanUpTextWithOpenAI(text)

            console.log(text)

            //placeholder - at this point insert cleaned up text into DB
            
        } catch (err) {
            console.log(link, err)
        }
    })

    await Promise.all(promises)


}

let company = {
    url: "https://attentivemobile.com/"
}

getArticles(company)

const getContent = (company) => {

}

module.exports = {
    getTweets,
    getCapterraReviews,
    getG2Reviews,
    getArticles,
    getContent
    
}