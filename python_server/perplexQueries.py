import perplexity
import time

# perplexity_cli = perplexity.Client(perplexity_headers, perplexity_cookies)
# perplexity_cli.create_account(emailnator_headers, emailnator_cookies) # Creates a new gmail, so your 5 copilots will be renewed. You can pass this one if you are not going to use "copilot" mode

# modes = ['concise', 'copilot']
# focus = ['internet', 'scholar', 'writing', 'wolfram', 'youtube', 'reddit', 'wikipedia']
# result = perplexity_cli.search('Please create a detailed list of the features that Zendesk offers', mode='concise', focus='internet')
# print(result["text"]["answer"])

# perplexity_cli.create_account(emailnator_headers, emailnator_cookies) # Call this function when you're out of copilots

def getFeaturesFromPerplexity(companyName, PPheaders, PPcookies):
    try: 
        perplexity_cli = perplexity.Client(PPheaders, PPcookies)
        result = perplexity_cli.search(f'Please create a detailed list of the features that {companyName} offers', mode='concise', focus='internet')
        return result["text"]["answer"]
    except Exception as e:
        print (e)

def getSWOTFromPerplexity(companyName, PPheaders, PPcookies):
    try: 
        perplexity_cli = perplexity.Client(PPheaders, PPcookies)
        result = perplexity_cli.search(f'Please create a SWOT analysis of this software company: {companyName}.', mode='concise', focus='internet')
        return result["text"]["answer"]
    except Exception as e:
        print (e)


# def doesCompanyHaveFeature(companyName, featureName):
#     perplexity_cli = perplexity.Client(perplexity_headers, perplexity_cookies)
#     print("starting search for ", companyName, featureName)
#     result = perplexity_cli.search(f'Does {companyName} offer a {featureName} feature? Reply with a summary.', mode='concise', focus='internet')
#     print("finished search for ", companyName, featureName)
#     return result["text"]["answer"]

def doesCompanyHaveFeature(companyName, featureName, PPheaders, PPcookies):
    MAX_RETRIES = 3
    RETRY_DELAY = 2  # time to wait before retrying, in seconds
    
    for attempt in range(MAX_RETRIES):

        try:
            perplexity_cli = perplexity.Client(PPheaders, PPcookies)
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


# print(getSWOTFromPerplexity('Zendesk'))