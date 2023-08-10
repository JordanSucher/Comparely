const axios = require('axios')
const { Op } = require('sequelize');
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const Sitemapper = require('sitemapper');
const fs = require('fs')
const { models: CompanyData } = require('../db')
const { Configuration, OpenAIApi } = require("openai");
const { models: { User, Company, CompanyComparisonPoint, CompanyDataRaw } } = require('../db')



const configuration = new Configuration({
    apiKey: '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',
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

    // Remove basic JavaScript lines
    text = text.replace(/if \(.*\)\s*{\s*.*\s*}\s*else.*/g, '');
    
    // Remove URLs or File Paths
    text = text.replace(/http:\/\/[^\s]+|\.\w{2,4}/g, '');
    
    // Remove JSON-like Metadata
    text = text.replace(/"\w+":\s*"[^"]*"/g, '');

    // Remove Yoast SEO Tags
    text = text.replace(/Yoast SEO.*plugin/g, '');

    // Remove Twitter-Related Metadata
    text = text.replace(/twitter_.*:.*,/g, '');
  
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
        max_tokens: 3500,
        messages: [{role: "user", content: 'Strip out the unnecessary content and reply with the full article and the publication date and no other text. In exactly this format: {"article": article, "pubdate": mm/dd/yy}.    Article:' + input}],
      });
      return chatCompletion.data.choices[0].message.content;
    } catch (err) {
        console.log(err.response.data.error.message)
    }
      
}

const cleanUpSitePageWithOpenAI = async (text) => {

    let input = text
    input = stripMetadataAndFormatting(text)
    

    try {
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        max_tokens: 3500,
        messages: [{role: "user", content: 'Strip out the unnecessary content and reply with just the page text and nothing else.    Page:' + input}],
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

try {

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

  
    result = await axios.get(crunchbaseUrl,
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com'
        }
    })
  

    $ = cheerio.load(result.data)

    $(".activity-url-title").each((index, element) => {
        links.push(element.attribs.href)
    })
    
    //Upsert the articles into the company_data_raw table and then identify which articles we haven't scraped yet
    let promises = links.map(async link => {
        await CompanyDataRaw.upsert({
            url: link,
            type: 'article',
            company_id: company.id
        })
    })

    await Promise.all(promises)

    let newLinks = await CompanyDataRaw.findAll({
        where: {
            type: 'article',
            text: {
                [Op.is]: null
            }
        }
    })

    newLinks = newLinks.map(link => link.url)

    //now we can get the articles.
    promises = newLinks.map(async link => {
        //for each link, go to the page and grab the whole body and title and stick in DB
    
        let result = await axios.get(link,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.google.com'
            }
        })
        $ = cheerio.load(result.data)
        let text = $("body").text()

        //add a 2s delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        text = await cleanUpTextWithOpenAI(text)

        console.log(text)

        text = JSON.parse(text)

        await CompanyDataRaw.upsert({
            url: link,
            text: text.article,
            date: new Date(text.pubdate),
            type: 'article',
            company_id: company.id
        })        
      
    })

    await Promise.all(promises)

    return true

} catch (err) {
    console.log(err)
}


}

let company = {
    url: "https://zendesk.com/"
}

// getArticles(company)

const getContent = async (company) => {

    try{

        const sitemap = new Sitemapper();
        let pages

        await sitemap.fetch(company.url+"sitemap.xml").then(function(sites) {
            pages = sites.sites
        });

        //upsert pages into DB

        //do filtering
        pages = pages
        .filter (page => !page.includes('blog'))
        .filter(page => !page.includes('campaign'))
        .filter(page => !page.includes('customer'))
        .filter(page => !page.includes('webinar'))
        .filter(page => !page.includes('error'))
        .filter(page => (page.match(/\//g) || []).length <= 5)


        let promises = pages.map(async page => {
            await CompanyDataRaw.upsert({
                url: page,
                type: 'site',
                company_id: company.id
            })
        })

        await Promise.all(promises)

        //get the articles w no content
        let newPages = await CompanyDataRaw.findAll({
            where: {
                type: 'site',
                company_id: company.id,
                text: {
                    [Op.is]: null
                }
            }
        })
    

        // get all the content
        for (let i = 0; i < newPages.length; i++) {
            const page = newPages[i];
            
            try {
                let result = await axios.get(page.url);
                let $ = cheerio.load(result.data);
                $('script, style').remove();
                let text = $("body").text();
                text = await stripMetadataAndFormatting(text);
        
                //add to DB
                await CompanyDataRaw.upsert({
                    id: page.id,
                    url: page.url,
                    text: text,
                    type: 'site',
                    company_id: company.id
                });
        
                //add a brief pause
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
                console.error(`Error fetching or processing URL: ${page.url}. Error: ${error.message}`);
            }
        }

        console.log("Finished getting content for " + company.name)
        return true
        
    } catch (err) {
        console.log(err)
    }

}

// getContent(company)

module.exports = {
    getTweets,
    getCapterraReviews,
    getG2Reviews,
    getArticles,
    getContent
    
}