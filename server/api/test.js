const puppeteer = require('puppeteer')
const fs = require('fs')
const randomUA = require('random-useragent')

const getPPheaders = async () => {

  let PPcookies
  let PPheaders
  let browser

  // const browser = await puppeteer.launch({headless: "new"});
  console.log ("Using Browserless")
  // browser = await puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?stealth&token=' + "f49421ea-655b-4359-91bf-c108c917ec89" + "&headless=false" });
  browser = await puppeteer.launch({ headless: "new", args: [
    '--proxy-server=http=143.244.182.101:80',
  ]});

  const page = await browser.newPage();
  
  // attach to the 'request' event to log all network requests
  page.on('request', async request => {
    let url = request.url()
    if (url.includes('/api/auth/signin/email')) {
      PPheaders = request.headers()
      PPcookies = await page.cookies()
    }
    
  });

  await page.setViewport({
      width: 1200,
      height: 1900,
    });  


  await page.setUserAgent(randomUA.getRandom())
  
  await page.goto('https://www.perplexity.ai/');
    // await page.goto('https://google.com/');
  

  const screenshot = await page.screenshot();
  fs.writeFileSync('screenshot.png', screenshot);

  console.log ("Screenshot saved")
 

  await page.waitForSelector(".ml-md > button");
  await page.click(".ml-md > button");
  await page.waitForSelector(".max-w-sm input");
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

  return {PPheaders: JSON.stringify(PPheaders), PPcookies: JSON.stringify(PPcookiesObj)}
}


getPPheaders();

module.exports = getPPheaders