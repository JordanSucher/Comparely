require('dotenv').config();
const { Document, VectorStoreIndex, OpenAI } = require('llamaindex');

const openai = new OpenAI({
  api_key: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo"
});

const removeHtmlTags = (text) => {
  return text.replace(/<\/?[^>]+(>|$)/g, '');
}

const analyzePageContent = async (rawHtml) => {
  // Clean up the HTML
  const cleanedText = removeHtmlTags(rawHtml);

  // Query OpenAI for analysis

  const response = await openai.complete(`Analyze the following raw html (which has been cleaned a bit) and generate a SWOT analysis for the company:\n${cleanedText}`, { temperature: 0.4});

  console.log(response.message.content);
}

// call the function e.g.
// analyzePageContent(scrapedData);

// What I need to develope after webscraper
// Chaining multiple prompts based off client's site, and comparisons to possible competition
// Maybe end with a ranked list of companies based off threat and toggle-able descriptions below of analysis (cooking it into the frontend)
// Overall conclusion?
// Need helper functions to tie everything together (chain ai prompts and possible storage), and perhaps let the user ask the AI things about the current state of things