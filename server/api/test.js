const puppeteer = require('puppeteer')

let PPcookies
let PPheaders

const getPPheaders = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    
    // attach to the 'request' event to log all network requests
    page.on('request', async request => {
      let url = request.url()
      if (url.includes('/api/auth/signin/email')) {
        PPheaders = request.headers()
        PPcookies = await page.cookies()
      }
    });
  
    await page.goto('https://www.perplexity.ai/');
    await page.click(".ml-md > button");
    await page.click(".max-w-sm input");
    await page.type(".max-w-sm input", 'a@a.com', {delay: 100});
    await page.click('div.border-t.mt-md button');
    // add a short sleep
    await new Promise(resolve => setTimeout(resolve, 3000));
    await browser.close();

    let PPcookiesObj = {}
    PPcookies.forEach(cookie => {
        PPcookiesObj[cookie.name] = cookie.value
    })

    console.log("PPCookies", PPcookiesObj)
    console.log("PPHeaders", PPheaders)

    return {PPcookiesObj, PPheaders}
  }

getPPheaders();

module.exports = getPPheaders