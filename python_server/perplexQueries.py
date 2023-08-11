import perplexity
import time

perplexity_headers = {
    'authority': 'www.perplexity.ai',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'baggage': 'sentry-environment=production,sentry-release=kt-ftNnB7T_jRgca8OaYw,sentry-public_key=bb45aa7ca2dc43b6a7b6518e7c91e13d,sentry-trace_id=8a3a9b760d154d47afe3eebcac6a0131',
    'content-type': 'application/x-www-form-urlencoded',
    # 'cookie': '_ga=GA1.1.779141588.1691778150; next-auth.csrf-token=cb59506ca36ac465b726a37d35ccfdc962d70688b11b6a75eb0e5773f0a5c810%7Cfd83ee9e92e74fb0a8815cc6886fb668e8318dbc967ef6ea4aa15922f1c2fba9; __Secure-next-auth.callback-url=https%3A%2F%2Fwww.perplexity.ai%2Fapi%2Fauth%2Fsignin-callback%3Fredirect%3Dhttps%253A%252F%252Fwww.perplexity.ai; mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel=%7B%22distinct_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24device_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; __cflb=02DiuDyvFMmK5p9jVbWbam6CcSLCt41hakHV52SCFuitL; _ga_SH9PRBQG23=GS1.1.1691778149.1.1.1691778177.0.0.0; AWSALB=7dWmZ1FqMsEY+D477NxZqqzSIzZjJZfMeQ0nqsthT1CgaDbnOd6N6mzUrqUHC2f4zf6BtCE5poug4zeOhIX75fk6MghTB0ARNzNnRvaD4J28FIGnyMTbaeWROfRv; AWSALBCORS=7dWmZ1FqMsEY+D477NxZqqzSIzZjJZfMeQ0nqsthT1CgaDbnOd6N6mzUrqUHC2f4zf6BtCE5poug4zeOhIX75fk6MghTB0ARNzNnRvaD4J28FIGnyMTbaeWROfRv',
    'origin': 'https://www.perplexity.ai',
    'referer': 'https://www.perplexity.ai/',
    'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sentry-trace': '8a3a9b760d154d47afe3eebcac6a0131-bba000309ec1ecbf-0',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
}

perplexity_cookies = {
    '_ga': 'GA1.1.779141588.1691778150',
    'next-auth.csrf-token': 'cb59506ca36ac465b726a37d35ccfdc962d70688b11b6a75eb0e5773f0a5c810%7Cfd83ee9e92e74fb0a8815cc6886fb668e8318dbc967ef6ea4aa15922f1c2fba9',
    '__Secure-next-auth.callback-url': 'https%3A%2F%2Fwww.perplexity.ai%2Fapi%2Fauth%2Fsignin-callback%3Fredirect%3Dhttps%253A%252F%252Fwww.perplexity.ai',
    'mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel': '%7B%22distinct_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24device_id%22%3A%20%22189e5d5ec11e2c-0e6b65b82ad6a8-1a525634-1ce26a-189e5d5ec122689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D',
    '__cflb': '02DiuDyvFMmK5p9jVbWbam6CcSLCt41hakHV52SCFuitL',
    '_ga_SH9PRBQG23': 'GS1.1.1691778149.1.1.1691778177.0.0.0',
    'AWSALB': '7dWmZ1FqMsEY+D477NxZqqzSIzZjJZfMeQ0nqsthT1CgaDbnOd6N6mzUrqUHC2f4zf6BtCE5poug4zeOhIX75fk6MghTB0ARNzNnRvaD4J28FIGnyMTbaeWROfRv',
    'AWSALBCORS': '7dWmZ1FqMsEY+D477NxZqqzSIzZjJZfMeQ0nqsthT1CgaDbnOd6N6mzUrqUHC2f4zf6BtCE5poug4zeOhIX75fk6MghTB0ARNzNnRvaD4J28FIGnyMTbaeWROfRv',
}

emailnator_headers = {
    'authority': 'www.emailnator.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    # 'cookie': '_ga=GA1.1.449924585.1691708664; mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel=%7B%22distinct_id%22%3A%20%22189e1b1a93d1648-00daf69175628b-1a525634-1ce26a-189e1b1a93e2792%22%2C%22%24device_id%22%3A%20%22189e1b1a93d1648-00daf69175628b-1a525634-1ce26a-189e1b1a93e2792%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fgithub.com%2Fhelallao%2Fperplexity-ai%22%2C%22%24initial_referring_domain%22%3A%20%22github.com%22%7D; XSRF-TOKEN=eyJpdiI6ImRlQXJ2RW1PQnIxdlljbVhOWFpSZlE9PSIsInZhbHVlIjoiUUtvaWsxS1hXamhiT0JzazIwVXdzOWhzTTN3d0NwY294OEdDMmorOGtkQWQzWkVYNm84bXJLbEp2Y2xBU3cxakNUdUg3ZFNXUjZuTXhiS2VnTnRCb1RLeE1yQmdHNlBucEdyQ1h6QzZ3anFGcHpabExLaS9nYUZ5dnEvZjR4TnIiLCJtYWMiOiI1YmU2ODY2ZDU0ZmZiNmYzN2QwMTRhMjUxYWM1Njk5OWM5N2I2YTcyNjhiYTRjYTY5NzhhYjM3OTQ1NjcyYTUzIiwidGFnIjoiIn0%3D; gmailnator_session=eyJpdiI6IkU5MzkrbTNZS3ZFUkNDNy9OSXQwUWc9PSIsInZhbHVlIjoiM1AvWVBYaXVTdUh5Zlk3c2xUWEVpdlRyK3Y3MTZEWGhvNHZNcVNueWVWWC9PcjNqb0F0WU8vZzluSEZjc3VDVWl5VlVIcXlOeTllSFJadmFwQml4TjJWODUwR0tsZGVtNW90Z24xNWU3aDNNUTU3K0xzaHdyZkdjY1JSVnFoWnciLCJtYWMiOiIxODVhYzZhNmU5NjYwZTU0MGY3MTEzNTU4ZWRmMTQ4NTM0YTdhODE3YjQ1NzcyOWFmMjBkMDc2MDNmNTRiZTkyIiwidGFnIjoiIn0%3D; __gads=ID=4cb8f5274985aa3d-2298091598e300f3:T=1691708693:RT=1691708693:S=ALNI_MbrsfkDBolDpoFRdnCXiRr-1B5QXg; __gpi=UID=00000d8a2b7e5f27:T=1691708693:RT=1691708693:S=ALNI_Ma5ZlUjU9rAlmluyeYo3KYZ8_a-jg; _cc_id=cc4c2b0a447ce2c51fbcec8b070a26b9; panoramaId_expiry=1692313496398; panoramaId=a9048180c4209d553b062a723fe916d53938105f592814db1356a9a5415c5ace; panoramaIdType=panoIndiv; _ga_6R52Y0NSMR=GS1.1.1691708664.1.1.1691708697.0.0.0; FCNEC=%5B%5B%22AKsRol_SgEt2sSS9Q1qNeJfgZlSJRmPqimQCK1asTog9la7L-zSC4HIKGQXZKe7a6Li0CHKpU6cW_cbQcvU4WVnx2t7TlRsXWXUX20vnMgtTxhLNMQefXq-5E1VIO_UyF_MQIIqevp9A5rpw2TCVhWZ7Hnp99GejIQ%3D%3D%22%5D%2Cnull%2C%5B%5D%5D; cto_bundle=eyftjV9yTnBLbHlBZ0syRTFIcDVhaXlpWWg3d1ppSGp5Qkx1R3NoZDIlMkJtTzdaNlpyU3pyTm1MU1NSQmJsdG1NOGdydjl4NHNsZHYxVDBnQk9lZng2SERqU3pwZmhLNW1sS0l4YjJ1aUolMkJCSXBEOXdyd01KRmZHblR2REl5RGJKellPTUdXS1BkMk1IQ2VkcFF6MnElMkZ0NjJCVmclM0QlM0Q',
    'origin': 'https://www.emailnator.com',
    'referer': 'https://www.emailnator.com/inbox/d.am.ari.k.ohe.n@gmail.com',
    'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
    'x-xsrf-token': 'eyJpdiI6ImRlQXJ2RW1PQnIxdlljbVhOWFpSZlE9PSIsInZhbHVlIjoiUUtvaWsxS1hXamhiT0JzazIwVXdzOWhzTTN3d0NwY294OEdDMmorOGtkQWQzWkVYNm84bXJLbEp2Y2xBU3cxakNUdUg3ZFNXUjZuTXhiS2VnTnRCb1RLeE1yQmdHNlBucEdyQ1h6QzZ3anFGcHpabExLaS9nYUZ5dnEvZjR4TnIiLCJtYWMiOiI1YmU2ODY2ZDU0ZmZiNmYzN2QwMTRhMjUxYWM1Njk5OWM5N2I2YTcyNjhiYTRjYTY5NzhhYjM3OTQ1NjcyYTUzIiwidGFnIjoiIn0=',
}

emailnator_cookies = {
    '_ga': 'GA1.1.449924585.1691708664',
    'mp_6f4de78898d87a1c8d7b7c5bd8b97049_mixpanel': '%7B%22distinct_id%22%3A%20%22189e1b1a93d1648-00daf69175628b-1a525634-1ce26a-189e1b1a93e2792%22%2C%22%24device_id%22%3A%20%22189e1b1a93d1648-00daf69175628b-1a525634-1ce26a-189e1b1a93e2792%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fgithub.com%2Fhelallao%2Fperplexity-ai%22%2C%22%24initial_referring_domain%22%3A%20%22github.com%22%7D',
    'XSRF-TOKEN': 'eyJpdiI6ImRlQXJ2RW1PQnIxdlljbVhOWFpSZlE9PSIsInZhbHVlIjoiUUtvaWsxS1hXamhiT0JzazIwVXdzOWhzTTN3d0NwY294OEdDMmorOGtkQWQzWkVYNm84bXJLbEp2Y2xBU3cxakNUdUg3ZFNXUjZuTXhiS2VnTnRCb1RLeE1yQmdHNlBucEdyQ1h6QzZ3anFGcHpabExLaS9nYUZ5dnEvZjR4TnIiLCJtYWMiOiI1YmU2ODY2ZDU0ZmZiNmYzN2QwMTRhMjUxYWM1Njk5OWM5N2I2YTcyNjhiYTRjYTY5NzhhYjM3OTQ1NjcyYTUzIiwidGFnIjoiIn0%3D',
    'gmailnator_session': 'eyJpdiI6IkU5MzkrbTNZS3ZFUkNDNy9OSXQwUWc9PSIsInZhbHVlIjoiM1AvWVBYaXVTdUh5Zlk3c2xUWEVpdlRyK3Y3MTZEWGhvNHZNcVNueWVWWC9PcjNqb0F0WU8vZzluSEZjc3VDVWl5VlVIcXlOeTllSFJadmFwQml4TjJWODUwR0tsZGVtNW90Z24xNWU3aDNNUTU3K0xzaHdyZkdjY1JSVnFoWnciLCJtYWMiOiIxODVhYzZhNmU5NjYwZTU0MGY3MTEzNTU4ZWRmMTQ4NTM0YTdhODE3YjQ1NzcyOWFmMjBkMDc2MDNmNTRiZTkyIiwidGFnIjoiIn0%3D',
    '__gads': 'ID=4cb8f5274985aa3d-2298091598e300f3:T=1691708693:RT=1691708693:S=ALNI_MbrsfkDBolDpoFRdnCXiRr-1B5QXg',
    '__gpi': 'UID=00000d8a2b7e5f27:T=1691708693:RT=1691708693:S=ALNI_Ma5ZlUjU9rAlmluyeYo3KYZ8_a-jg',
    '_cc_id': 'cc4c2b0a447ce2c51fbcec8b070a26b9',
    'panoramaId_expiry': '1692313496398',
    'panoramaId': 'a9048180c4209d553b062a723fe916d53938105f592814db1356a9a5415c5ace',
    'panoramaIdType': 'panoIndiv',
    '_ga_6R52Y0NSMR': 'GS1.1.1691708664.1.1.1691708697.0.0.0',
    'FCNEC': '%5B%5B%22AKsRol_SgEt2sSS9Q1qNeJfgZlSJRmPqimQCK1asTog9la7L-zSC4HIKGQXZKe7a6Li0CHKpU6cW_cbQcvU4WVnx2t7TlRsXWXUX20vnMgtTxhLNMQefXq-5E1VIO_UyF_MQIIqevp9A5rpw2TCVhWZ7Hnp99GejIQ%3D%3D%22%5D%2Cnull%2C%5B%5D%5D',
    'cto_bundle': 'eyftjV9yTnBLbHlBZ0syRTFIcDVhaXlpWWg3d1ppSGp5Qkx1R3NoZDIlMkJtTzdaNlpyU3pyTm1MU1NSQmJsdG1NOGdydjl4NHNsZHYxVDBnQk9lZng2SERqU3pwZmhLNW1sS0l4YjJ1aUolMkJCSXBEOXdyd01KRmZHblR2REl5RGJKellPTUdXS1BkMk1IQ2VkcFF6MnElMkZ0NjJCVmclM0QlM0Q',
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
