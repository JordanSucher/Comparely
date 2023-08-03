const axios = require('axios')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const { models: CompanyData } = require('../db')



const getTweets = (company) => {



}

const getCapterraReviews = (company) => {

}

const getG2Reviews = (company) => {

}

const getArticles = async (company) => {
    //we are going to get articles from crunchbase. we need to identify the crunchbase URL for the company

    const result = await axios.get("https://www.google.com/search?q=" + company.url + " crunchbase")
    
    let links = []
    $("a").each((index, element) => {
        links.push(element.attribs.href)
    })
    
    links = links.filter(link => link.includes("crunchbase.com"))

    let crunchbaseUrl = links[0].split('?q=')[1].split('&')[0] + "/signals_and_news/timeline"

}

let company = {
    url: "https://zendesk.com/"
}

getArticles(company)

const getContent = (company) => {

    // dummy code that prints all the text in every element in the body of the page
    // const result = await axios.get("https://www.zendesk.com")

    // let $ = cheerio.load(result.data)
    // $("body *").each((index, element) => {
    //     console.log($(element).text())
    // })


}

module.exports = {
    getTweets,
    getCapterraReviews,
    getG2Reviews,
    getArticles,
    getContent
    
}