import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useParams } from "react-router-dom";

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

export const fetchCompanyNames = createAsyncThunk("comparison/fetchCompanyNames", async () => {
  const companyNames = {};

  const promises = dataItems.map(async (obj) => {
    if (!companyNames[obj.companyId]) {
      const { data } = await axios.get(`/api/companies/${obj.companyId}`);
      return { id: obj.companyId, name: data.name };
    }
    return null;
  });

  const results = await Promise.all(promises);

  results.forEach((result) => {
    if (result) {
      companyNames[result.id] = toTitleCase(result.name);
    }
  });
  return { companyNames, dataType };
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {

      state.text = action.payload;
      state.companyProfiles = action.payload.text.features;
      state.swots = action.payload.text.swots;
      state.articles = action.payload.text.articles;
    });
    builder.addCase(fetchCompanyNames.fulfilled, (state, action) => {
      const { companyNames, dataType } = action.payload;
      state.companyNames[dataType] = companyNames;
    })
  },
});

export default comparisonSlice.reducer;
