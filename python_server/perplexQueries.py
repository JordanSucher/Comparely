import perplexity
import time

perplexity_headers = {
    'authority': 'www.perplexity.ai',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'baggage': 'sentry-environment=production,sentry-release=0LqSSDl3jscXvgGfolrwE,sentry-public_key=bb45aa7ca2dc43b6a7b6518e7c91e13d,sentry-trace_id=2535d7de08724ac69d313d864d2925b2',
    'content-type': 'application/x-www-form-urlencoded',
    # 'cookie': '_ga=GA1.1.779141588.1691778150; next-auth.csrf-token=cb59506ca36ac465b726a37d35ccfdc962d70688b11b6a75eb0e5773f0a5c810%7Cfd83ee9e92e74fb0a8815cc6886fb668e8318dbc967ef6ea4aa15922f1c2fba9; __Secure-next-auth.callback-url=https%3A%2F%2Fwww.perplexity.ai%2Fapi%2Fauth%2Fsignin-callback%3Fredirect%3Dhttps%253A%252F%252Fwww.perplexity.ai%252F; cf_clearance=1_XLnW0yXklaKIx29J6n1pU5_Y6Iie6E82XBpkFW3Wg-1691778198-0-1-6bacbd56.d78ecddf.3cade2b6-160.0.0; mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel=%7B%22distinct_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24device_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; _ga_SH9PRBQG23=GS1.1.1692046006.2.0.1692046006.0.0.0; __cflb=02DiuDyvFMmK5p9jVbWbam6CcSLCt41hZvoBBoRURjMwA; AWSALB=ISwIZRU967whBAnJJYs1aNJD47MXKf7mipmyJ51Hy6XbmgTXTSof+IeHXl/FsrvpcXl3/XqfP/f79CGarE3eEP+U7oKKOHxD1Sz0A2g+XunTjVNSshDIjqnNKjP9; AWSALBCORS=ISwIZRU967whBAnJJYs1aNJD47MXKf7mipmyJ51Hy6XbmgTXTSof+IeHXl/FsrvpcXl3/XqfP/f79CGarE3eEP+U7oKKOHxD1Sz0A2g+XunTjVNSshDIjqnNKjP9',
    'origin': 'https://www.perplexity.ai',
    'referer': 'https://www.perplexity.ai/',
    'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sentry-trace': '2535d7de08724ac69d313d864d2925b2-b9f5ce18ea7a1bf0-0',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
}

perplexity_cookies = {
        '_ga': 'GA1.1.779141588.1691778150',
    'next-auth.csrf-token': 'cb59506ca36ac465b726a37d35ccfdc962d70688b11b6a75eb0e5773f0a5c810%7Cfd83ee9e92e74fb0a8815cc6886fb668e8318dbc967ef6ea4aa15922f1c2fba9',
    '__Secure-next-auth.callback-url': 'https%3A%2F%2Fwww.perplexity.ai%2Fapi%2Fauth%2Fsignin-callback%3Fredirect%3Dhttps%253A%252F%252Fwww.perplexity.ai%252F',
    'cf_clearance': '1_XLnW0yXklaKIx29J6n1pU5_Y6Iie6E82XBpkFW3Wg-1691778198-0-1-6bacbd56.d78ecddf.3cade2b6-160.0.0',
    'mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel': '%7B%22distinct_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24device_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D',
    '_ga_SH9PRBQG23': 'GS1.1.1692046006.2.0.1692046006.0.0.0',
    '__cflb': '02DiuDyvFMmK5p9jVbWbam6CcSLCt41hZvoBBoRURjMwA',
    'AWSALB': 'ISwIZRU967whBAnJJYs1aNJD47MXKf7mipmyJ51Hy6XbmgTXTSof+IeHXl/FsrvpcXl3/XqfP/f79CGarE3eEP+U7oKKOHxD1Sz0A2g+XunTjVNSshDIjqnNKjP9',
    'AWSALBCORS': 'ISwIZRU967whBAnJJYs1aNJD47MXKf7mipmyJ51Hy6XbmgTXTSof+IeHXl/FsrvpcXl3/XqfP/f79CGarE3eEP+U7oKKOHxD1Sz0A2g+XunTjVNSshDIjqnNKjP9',
}


perplexity_cli = perplexity.Client(perplexity_headers, perplexity_cookies)
# perplexity_cli.create_account(emailnator_headers, emailnator_cookies) # Creates a new gmail, so your 5 copilots will be renewed. You can pass this one if you are not going to use "copilot" mode

# modes = ['concise', 'copilot']
# focus = ['internet', 'scholar', 'writing', 'wolfram', 'youtube', 'reddit', 'wikipedia']
# result = perplexity_cli.search('Please create a detailed list of the features that Zendesk offers', mode='concise', focus='internet')
# print(result["text"]["answer"])

# perplexity_cli.create_account(emailnator_headers, emailnator_cookies) # Call this function when you're out of copilots

def getFeaturesFromPerplexity(companyName):
    result = perplexity_cli.search(f'Please create a detailed list of the features that {companyName} offers', mode='concise', focus='internet')
    return result["text"]["answer"]

def getSWOTFromPerplexity(companyName):
    result = perplexity_cli.search(f'Please create a SWOT analysis of this software company: {companyName}.', mode='concise', focus='internet')
    return result["text"]["answer"]


# def doesCompanyHaveFeature(companyName, featureName):
#     perplexity_cli = perplexity.Client(perplexity_headers, perplexity_cookies)
#     print("starting search for ", companyName, featureName)
#     result = perplexity_cli.search(f'Does {companyName} offer a {featureName} feature? Reply with a summary.', mode='concise', focus='internet')
#     print("finished search for ", companyName, featureName)
#     return result["text"]["answer"]

def doesCompanyHaveFeature(companyName, featureName):
    MAX_RETRIES = 3
    RETRY_DELAY = 2  # time to wait before retrying, in seconds
    
    for attempt in range(MAX_RETRIES):

        try:
            perplexity_cli = perplexity.Client(perplexity_headers, perplexity_cookies)
            print("starting search for ", companyName, featureName)
            result = perplexity_cli.search(f'Does {companyName} offer a {featureName} feature? Reply with a summary.', mode='concise', focus='internet')
            if result is None:
                raise Exception("Received None response from Perplexity.")
            answer = result["text"]["answer"]
            print("finished search for ", companyName, featureName)
            return answer

        except Exception as e:
            print(f"Error on attempt {attempt + 1} for {companyName} {featureName}: ", e)
            if attempt < (MAX_RETRIES - 1):  # if it's not the last attempt
                print(f"Retrying in {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            else:
                print(f"Failed after {MAX_RETRIES} attempts.")
                return None  # or raise an exception if you want to notify the caller about the failure
