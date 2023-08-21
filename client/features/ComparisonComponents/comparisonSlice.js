import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { useParams } from "react-router-dom";


export const getFirstTwoSentences = (text) => {
  // Split by sentences and grab first 2
  // also, strip the source citing
  if (text) {
    let strippedText = text.replace(/\[\d+\]/g, "");
    const sentences = strippedText.match(/[^.!?]+[.!?]/g);
    return sentences?.slice(0, 2).join(" ") || "";
  }
  // Take the first three
};
function toTitleCase(str) {
  if (str) {
    return str
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
}

export const fetchData = createAsyncThunk(
  "comparison/fetchData",
  async (comparisonId) => {
    try {
      const { data } = await axios.get(`/api/comparisons/${comparisonId}`);

      let parsedData = data;

      if (data.text) {
        parsedData = {
          ...data,
          text: JSON.parse(data.text),
        };
      }
      return parsedData;
    } catch (error) {
      console.log(`Error fetching data:`, error);
    }
  }
);

export const fetchCompanyNames = createAsyncThunk("comparison/fetchCompanyNames", async (dataArray) => {
  // Initialize an empty object to store company names with companyId as keys
  const companyNames = {};

  // Create an array of promises using the dataArray
  const promises = dataArray.map(async (obj) => {
    // Check if the company name for this companyId has already been fetched
    if (!companyNames[obj.companyId]) {
      // Fetch company data from the API
      const { data } = await axios.get(`/api/companies/${obj.companyId}`);

      // Return an object with company id and name to be added to results array
      return { id: obj.companyId, name: data.name };
    }

    // Return null for companies that have already been fetched
    return null;
  });

  // Wait for all promises to complete and collect their results in the results array
  const results = await Promise.all(promises);

  // Iterate over the results array to add non-null entries to the companyNames object
  results.forEach((result) => {
    if (result) {
      // Add the company name to the companyNames object with companyId as key
      companyNames[result.id] = toTitleCase(result.name);
    }
  });
  // Return an object containing the companyNames object
  return { companyNames };
});

export const comparisonSlice = createSlice({
  name: "comparison",
  initialState: {
    id: null,
    text: {},
    companyProfiles: [],
    swots: [],
    aricles: [],
    companyNames: {},
    typingEffect: false,
  },
  reducers: {
    toggleTypingEffect: (state) => {
      state.typingEffect = !state.typingEffect;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {

      state.text = action.payload;
      state.companyProfiles = action.payload.text.features;
      state.swots = action.payload.text.swots;
      state.articles = action.payload.text.articles;
    });
    builder.addCase(fetchCompanyNames.fulfilled, (state, action) => {
      const { companyNames } = action.payload;
      console.log("payload:", companyNames)
      state.companyNames = companyNames;
    });
  },
});

export const { toggleTypingEffect } = comparisonSlice.actions;

export default comparisonSlice.reducer;
