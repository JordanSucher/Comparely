const axios = require('axios')
const { Op } = require('sequelize');
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const Sitemapper = require('sitemapper');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const { models: CompanyData } = require('../db')
const { Configuration, OpenAIApi } = require("openai");
const { models: { User, Company, CompanyComparisonPoint, CompanyDataRaw } } = require('../db')



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
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
    let input = stripMetadataAndFormatting(text);

    const maxRetries = 10; // Maximum number of retries
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-16k",
                max_tokens: 6000,
                messages: [{ role: "user", content: 'Summarize this into 3 concise bullets, and reply with the summary and the publication date and no other text. In exactly this format: {"summary": summary, "pubdate": mm/dd/yy}.    Article:' + input }],
            });
            return chatCompletion.data.choices[0].message.content;
        } catch (err) {
            console.log(`Error on attempt ${retryCount + 1}: ${err.response.data.error.message}`);
            retryCount++;

            if (retryCount < maxRetries) {
                console.log(`Retrying... (Attempt ${retryCount + 1})`);
                await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds before retrying
            } else {
                console.log(`Maximum retry attempts reached.`);
                return ""
            }
        }
    }

    // Return an error message if retries are exhausted
    return "Error: Maximum retry attempts reached.";
};

const cleanUpSitePageWithOpenAI = async (text) => {
    let input = stripMetadataAndFormatting(text);

    const maxRetries = 3; // Maximum number of retries
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-16k",
                max_tokens: 3500,
                messages: [{ role: "user", content: 'Strip out the unnecessary content and reply with just the page text and nothing else.    Page:' + input }],
            });
            return chatCompletion.data.choices[0].message.content;
        } catch (err) {
            console.log(`Error on attempt ${retryCount + 1}: ${err.response.data.error.message}`);
            retryCount++;

            if (retryCount < maxRetries) {
                console.log(`Retrying... (Attempt ${retryCount + 1})`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            } else {
                console.log(`Maximum retry attempts reached.`);
                break;
            }
        }
    }

    // Return an error message if retries are exhausted
    return "Error: Maximum retry attempts reached.";
};


const summarizeWithOpenAI = async (text) => {
    const maxRetries = 3; // Maximum number of retries
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-16k",
                max_tokens: 3500,
                messages: [{ role: "user", content: 'summarize this and return 1-3 concise bullet points and no other text. Exclude basic company info.          ' + text }],
            });
            return chatCompletion.data.choices[0].message.content;
        } catch (err) {
            console.log(`Error on attempt ${retryCount + 1}: ${err.response.data.error.message}`);
            retryCount++;

            if (retryCount < maxRetries) {
                console.log(`Retrying... (Attempt ${retryCount + 1})`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            } else {
                console.log(`Maximum retry attempts reached.`);
                return "";
            }
        }
    }

    // Return an error message if retries are exhausted
    return "Error: Maximum retry attempts reached.";
};



const getTweets = (company) => {


}

const getCapterraReviews = async (company) => {
    try {
        let result = await axios.get("https://www.google.com/search?q=" + company.url + "capterra")
        let $ = cheerio.load(result.data)
        let links = []
        $("a").each((index, element) => {
            links.push(element.attribs.href)
        })
        links = links.filter(link => link.includes("capterra.com"))

        let capterraProductId = links[0].split('?q=')[1].slice(27, 33)

        let productResults = await axios.get("https://www.capterra.com/spotlight/rest/reviews?apiVersion=2&productId=" + capterraProductId + "&from=0&sort=mostRecent&size=100", {
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "device=Desktop; country_code=US; pxcts=adacf924-3237-11ee-b33a-64656c55444d; _pxvid=adacf044-3237-11ee-b33a-61e7b07a12d9; seerid=912786e4-1647-4a82-9c7e-70b34e4119b6; _gcl_au=1.1.1645202352.1691092522; return_user=1612364808.1691092520|Thu Aug 03 2023 13:55:21 GMT-0600 (Mountain Daylight Time); return_user_session=1612364808.1691092520|Thu Aug 03 2023 13:55:21 GMT-0600 (Mountain Daylight Time)|new; _rdt_uuid=1691092522765.b0b0c22e-ca53-4c70-8519-bea637a945da; AMCVS_04D07E1C5E4DDABB0A495ED1%40AdobeOrg=1; _fbp=fb.1.1691092523495.38040353; ELOQUA=GUID=B277FE4FBE834A438B2885B7F4BD00E4; SignUpShowingProductToSaveExperiment=bed42bb0-3237-11ee-8856-f12611a85895; rt_var=prd; experimentSessionId=43dfd96c-3995-466f-9669-ce60c408538c; drift_aid=7613cd3d-8d4e-4f0c-935c-1bababd3bcd5; driftt_aid=7613cd3d-8d4e-4f0c-935c-1bababd3bcd5; _gid=GA1.2.2099254457.1691608741; _pxhd=oLXLcDQ-nyK-F1MdxjEzmPP6q1M/Xm31fba4zW2Vw3NP7aCke7FvHbGQXYYhJO8uyyd9iFO4zanYAHVWeidg3w==:5bW7LaRrpOIS/KyZ3KEwyad8Rrv13wzJJ9/eChwvfbQG1aDpL0tfrLnh2tflHdzVCYB-IZHNda-X2ck8sWONWp12ia93XYUgJ9bi7/pi3SQ=; _capterra2_session=17c7c29bf6f2e4f7dc6da9eebd054796; ln_or=eyIyNjk3MCI6ImQifQ%3D%3D; AMCV_04D07E1C5E4DDABB0A495ED1%40AdobeOrg=-637568504%7CMCIDTS%7C19581%7CMCMID%7C25140572024502758201503331266513126939%7CMCAAMLH-1692369695%7C7%7CMCAAMB-1692369695%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1691772095s%7CNONE%7CvVersion%7C5.1.1; seerses=e; drift_campaign_refresh=3ade4dd6-ab84-4e3d-9b3c-03224c814e59; _gcl_aw=GCL.1691787102.Cj0KCQjwuNemBhCBARIsADp74QShtdIlOfr_rBep5BfmiLuUNCGzGwOmpnpn05ohhq6uTvUhjQNlQzsaArygEALw_wcB; _gac_UA-126190-1=1.1691787110.Cj0KCQjwuNemBhCBARIsADp74QShtdIlOfr_rBep5BfmiLuUNCGzGwOmpnpn05ohhq6uTvUhjQNlQzsaArygEALw_wcB; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Aug+11+2023+16%3A52%3A45+GMT-0400+(Eastern+Daylight+Time)&version=202301.2.0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false; _ga_T9V61700R6=GS1.1.1691784880.7.1.1691787164.60.0.0; _ga=GA1.2.1612364808.1691092520; _uetsid=9953814036e911ee939aa5b855e6be05; _uetvid=ae6360b0323711ee96c8eb4151b0c09a; fs_lua=1.1691787165744; fs_uid=#18VAT4#7aeb328d-5272-4234-9476-32d0d4bb0bd6:2ffa8c28-9aa1-4b5d-8e76-888ed28b180d:1691784882089::12#/1722628523; _px3=9c9606d1a11451a0b8f55dde897700ca16a1875e5c2324d92d5c7ee5f2315537:VUmUM/YbGT7dRamR00WrpN2WDjuYmUbXiTV2iGY/97QEZRZ9oqqKYeRupWBhFBBoX8qv326ggByAjBD4stu78g==:1000:XQbQ6TiRNdKxCb44ZijpPD7EpufuUhsuzU++N7spujAkfPhW9sYrHHBoKdE5JHa4vFlaKnjAshaxzh0n2g0PzXedL+iKZWPozorlYn0FUiQvw99tkfjErT4lNG/SWp6uq7Alf+tueBKd0Up+CUO+YU7xaPfAe3ftoCw9f8Kx2CUx5E8xrJarboZM+MRJpzOFYw4L4w4IUPs1YMYbSps/3w==; _gat_UA-126190-1=1; _pxde=e817e69fc562487640b60d5865cd9ba82d1fe6290ef6a775c5e056bda852322d:eyJ0aW1lc3RhbXAiOjE2OTE3ODcyMjUwODksImZfa2IiOjAsImlwY19pZCI6W119; _ga_M5DGBDHG2R=GS1.1.1691784880.8.1.1691787230.60.0.0",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://www.capterra.com/p/179576/Attentive/reviews/",
                "Referrer-Policy": "origin-when-cross-origin"
            }
        })

        console.log(productResults.data)
        productResults.data.hits.map(async review => {
            let toSave = {
                functionalityRating: review["functionalityRating"],
                prosText: review["prosText"],
                globalReviewId: review["globalReviewId"],
                easeOfUseRating: review["easeOfUseRating"],
                recommendationRating: review["recommendationRating"],
                overallRating: review["overallRating"],
                consText: review["consText"],
                writtenOn: review["writtenOn"],
                valueForMoneyRating: review["valueForMoneyRating"],
                customerSupportRating: review["customerSupportRating"],
            };
            await CompanyDataRaw.upsert({
                url: review["globalReviewId"],
                text: JSON.stringify(toSave),
                date: new Date(review["writtenOn"]),
                type: 'review',
                company_id: company.id
            })
        })
    }
    catch (err) {
        console.log(err)
    }

}

const getG2Reviews = (company) => {
    // Launch puppeteer-stealth
    puppeteer.launch().then(async browser => {
        try {

            // Create a new page
            const page = await browser.newPage();
            // Set page view
            await page.setViewport({ width: 1280, height: 720 });

            //identify the g2 URL for the company
            let result = await axios.get("https://www.google.com/search?q=" + company.url + " g2")
            let $ = cheerio.load(result.data)
            let links = []
            $("a").each((index, element) => {
                links.push(element.attribs.href)
            })
            links = links.filter(link => link.includes("g2.com"))

            let gtwoUrl = links[0].split('?q=')[1].split('&')[0]
            console.log(gtwoUrl);



            // Navigate to the website
            await page.goto(gtwoUrl);

            // Wait for page to load
            await page.waitForSelector('div#reviews');

            const reviews = await page.evaluate(() => {
                // Get all divs with the class "paper" inside the nested-ajax-loading section
                const reviewCards = document.querySelectorAll('div#reviews .nested-ajax-loading .paper');

                // Extract the required data from each card
                const reviewData = [];
                reviewCards.forEach((card) => {
                    // Rating extraction (same as before)
                    const ratingDiv = card.querySelector('.stars');
                    let rating = '';
                    if (ratingDiv && ratingDiv.className.includes('stars-')) {
                        rating = ratingDiv.className.split('stars-')[1];
                    }

                    // Content extraction
                    const reviewBodyDiv = card.querySelector('[itemprop="reviewBody"]');
                    let content = '';
                    if (reviewBodyDiv) {
                        reviewBodyDiv.querySelectorAll('.spht').forEach(span => span.remove());
                        content = reviewBodyDiv.innerText.replace(/\n/g, ' ').trim();
                    }

                    // Date extraction
                    let date = '';
                    const dateSpan = card.querySelector('.time-stamp .x-current-review-date');
                    if (dateSpan) {
                        const metaTag = dateSpan.querySelector('meta');
                        const timeTag = dateSpan.querySelector('time');
                        if (metaTag) {
                            date = metaTag.getAttribute('content');
                        } else if (timeTag) {
                            date = timeTag.getAttribute('datetime');
                        }
                    }

                    reviewData.push({ rating, content, date });
                });

                return reviewData;
            });

            // Now you can add the unique IDs outside of the browser context
            const reviewsWithIds = reviews.map((review) => {
                return {
                    id: uuidv4(),
                    ...review
                };
            });
            for (const review of reviewsWithIds) {
                await CompanyDataRaw.upsert({
                    url: review.id,
                    text: {
                        review: review.content,
                        rating: review.rating,
                    },
                    date: review.date,
                    type: 'review',
                    company_id: company.id
                })
            }

            // Close the browser
            await browser.close();
        } catch (err) {
            console.log(err)
            await browser.close();
        }
    });
}

const getArticles = async (company) => {
    try {
        let links = await scrapeCrunchbaseForLinks(company);

        await upsertLinksToDatabase(links, company.id);

        let newLinks = await getNewLinksFromDatabase();

        await scrapeArticles(newLinks, company.id);

        return true;
    } catch (err) {
        console.error("An error occurred in getArticles:", err);
    }
}

const scrapeCrunchbaseForLinks = async (company) => {
    try {
        let result = await axios.get("https://www.google.com/search?q=" + company.url + " crunchbase");
        let $ = cheerio.load(result.data);
        let links = [];
        $("a").each((index, element) => {
            links.push(element.attribs.href);
        });
        links = links.filter(link => link.includes("crunchbase.com"));

        let crunchbaseUrl = links[0].split('?q=')[1].split('&')[0] + "/signals_and_news/timeline";

        result = await axios.get(crunchbaseUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com'
            }
        });

        $ = cheerio.load(result.data);
        links = [];
        $(".activity-url-title").each((index, element) => {
            links.push(element.attribs.href);
        });

        // just return the most recent 5
        links = links.slice(0, 5)

        return links;
    } catch (err) {
        console.error("Error scraping Crunchbase:", err);
        return [];
    }
}

const upsertLinksToDatabase = async (links, companyId) => {
    let promises = links.map(async link => {
        try {
            await CompanyDataRaw.upsert({
                url: link,
                type: 'article',
                company_id: companyId
            });
        } catch (err) {
            console.error(`Error upserting link ${link}:`, err);
        }
    });
    await Promise.all(promises);
}

const getNewLinksFromDatabase = async () => {
    try {
        let newLinks = await CompanyDataRaw.findAll({
            where: {
                type: 'article',
                text: {
                    [Op.is]: null
                }
            }
        });
        return newLinks.map(link => link.url);
    } catch (err) {
        console.error("Error getting new links from database:", err);
        return [];
    }
}

const scrapeArticles = async (newLinks, companyId) => {
    let promises = newLinks.map(async link => {
        try {
            let result = await axios.get(link, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.google.com'
                }
            });

            let $ = cheerio.load(result.data);
            $('script, style').remove();
            let text = $("body").text();
            text = await cleanUpTextWithOpenAI(text);
            text = JSON.parse(text);
            let summary = text.summary;
            let title = $('title').text();
            console.log("text", text)

            await CompanyDataRaw.upsert({
                url: link,
                text: JSON.stringify({ title: title, summary: summary }),
                date: new Date(text.pubdate),
                type: 'article',
                company_id: companyId
            });
        } catch (err) {
            console.error(`Error scraping article ${link}:`, err);
        }
    });

    await Promise.all(promises);
}

const getContent = async (company) => {

    try {

        const sitemap = new Sitemapper();
        let pages

        await sitemap.fetch(company.url + "sitemap.xml").then(function (sites) {
            pages = sites.sites
        });

        //upsert pages into DB

        //do filtering
        pages = pages
            .filter(page => !page.includes('blog'))
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

const getPPheaders = async () => {

    let PPcookies = {
        '_ga': 'GA1.1.779141588.1691778150',
        'next-auth.csrf-token': 'cb59506ca36ac465b726a37d35ccfdc962d70688b11b6a75eb0e5773f0a5c810%7Cfd83ee9e92e74fb0a8815cc6886fb668e8318dbc967ef6ea4aa15922f1c2fba9',
        '__Secure-next-auth.callback-url': 'https%3A%2F%2Fwww.perplexity.ai%2Fapi%2Fauth%2Fsignin-callback%3Fredirect%3Dhttps%253A%252F%252Fwww.perplexity.ai%252F',
        'cf_clearance': '6mQu_.CYG17jrgFUx79kszj6hXRmSV.4wxHsMcqemyE-1692046020-0-1-61c17541.45a6b9ca.36c02aa1-160.0.0',
        'g_state': '{"i_p":1692148302484,"i_l":1}',
        'mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel': '%7B%22distinct_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24device_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D',
        '_ga_SH9PRBQG23': 'GS1.1.1692212045.6.0.1692212045.0.0.0',
        '__cflb': '02DiuDyvFMmK5p9jVbWbam6CcSLCt41haFJWWCY7n8TGG',
        'AWSALB': 'vJYsqaXG1RBy2oSLvcvH8gUZgiX0VFjFWV0Gw1l0+NlbJq8Hv29JJnxOUSLW7TuPuLi7VLcxzMJsqzoIfJImmxBXYeXCoE1PRjMOaF/pvlqv2UA9T3XWD8WUUgYD',
        'AWSALBCORS': 'vJYsqaXG1RBy2oSLvcvH8gUZgiX0VFjFWV0Gw1l0+NlbJq8Hv29JJnxOUSLW7TuPuLi7VLcxzMJsqzoIfJImmxBXYeXCoE1PRjMOaF/pvlqv2UA9T3XWD8WUUgYD',
    }

    let PPheaders = {
        'authority': 'www.perplexity.ai',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'baggage': 'sentry-environment=production,sentry-release=XcoeFcVkihoD9mDh22VUl,sentry-public_key=bb45aa7ca2dc43b6a7b6518e7c91e13d,sentry-trace_id=5a58342f6a534caf9b22c73f48cf64b2',
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': '_ga=GA1.1.779141588.1691778150; next-auth.csrf-token=cb59506ca36ac465b726a37d35ccfdc962d70688b11b6a75eb0e5773f0a5c810%7Cfd83ee9e92e74fb0a8815cc6886fb668e8318dbc967ef6ea4aa15922f1c2fba9; __Secure-next-auth.callback-url=https%3A%2F%2Fwww.perplexity.ai%2Fapi%2Fauth%2Fsignin-callback%3Fredirect%3Dhttps%253A%252F%252Fwww.perplexity.ai%252F; cf_clearance=6mQu_.CYG17jrgFUx79kszj6hXRmSV.4wxHsMcqemyE-1692046020-0-1-61c17541.45a6b9ca.36c02aa1-160.0.0; g_state={"i_p":1692148302484,"i_l":1}; mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel=%7B%22distinct_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24device_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; _ga_SH9PRBQG23=GS1.1.1692212045.6.0.1692212045.0.0.0; __cflb=02DiuDyvFMmK5p9jVbWbam6CcSLCt41haFJWWCY7n8TGG; AWSALB=vJYsqaXG1RBy2oSLvcvH8gUZgiX0VFjFWV0Gw1l0+NlbJq8Hv29JJnxOUSLW7TuPuLi7VLcxzMJsqzoIfJImmxBXYeXCoE1PRjMOaF/pvlqv2UA9T3XWD8WUUgYD; AWSALBCORS=vJYsqaXG1RBy2oSLvcvH8gUZgiX0VFjFWV0Gw1l0+NlbJq8Hv29JJnxOUSLW7TuPuLi7VLcxzMJsqzoIfJImmxBXYeXCoE1PRjMOaF/pvlqv2UA9T3XWD8WUUgYD',
        'origin': 'https://www.perplexity.ai',
        'referer': 'https://www.perplexity.ai/',
        'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sentry-trace': '5a58342f6a534caf9b22c73f48cf64b2-9de99a25ada13ca9-0',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    }
    let browser

    // // const browser = await puppeteer.launch({headless: "new"});
    // if (process.env.BROWSERLESS_TOKEN) {
    //     console.log ("Using Browserless")
    //     browser = await puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?token=' + process.env.BROWSERLESS_TOKEN });
    // } else {
    //     console.log("Using puppeteer default browser")
    //     browser = await puppeteer.launch({ headless: "new" }); // you might want to replace "new" with true or false based on your needs.
    // }

    // browser = await puppeteer.launch({ headless: "new", args: [
    //     '--proxy-server=http=143.244.182.101:80',
    //   ]});


    // const page = await browser.newPage();

    // // attach to the 'request' event to log all network requests
    // page.on('request', async request => {
    //   let url = request.url()
    //   if (url.includes('/api/auth/signin/email')) {
    //     PPheaders = request.headers()
    //     PPcookies = await page.cookies()
    //   }
    // });

    // await page.setViewport({
    //     width: 1200,
    //     height: 1900,
    //   });
    // await page.goto('https://www.perplexity.ai/');
    // await page.waitForSelector(".ml-md > button");
    // await page.click(".ml-md > button");
    // await page.waitForSelector(".max-w-sm input");
    // await page.click(".max-w-sm input");
    // await page.type(".max-w-sm input", 'a@a.com', {delay: 100});
    // await page.click('div.border-t.mt-md button');
    // // add a short sleep
    // await new Promise(resolve => setTimeout(resolve, 3000));
    // await browser.close();

    // let PPcookiesObj = {}
    // PPcookies.forEach(cookie => {
    //     PPcookiesObj[cookie.name] = cookie.value
    // })

    // console.log("PPCookies", PPcookiesObj)
    // console.log("PPHeaders", PPheaders)

    return { PPheaders: JSON.stringify(PPheaders), PPcookies: JSON.stringify(PPcookies) }
}

module.exports = {
    getTweets,
    getCapterraReviews,
    getG2Reviews,
    getArticles,
    getContent,
    getPPheaders

}
