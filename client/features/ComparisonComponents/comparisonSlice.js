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

export const comparisonSlice = createSlice({
  name: "comparison",
  initialState: {
    id: null,
    text: {},
    swots: [],
    aricles: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {

      state.text = action.payload;
      state.swots = action.payload.text.swots;
      state.articles = action.payload.text.articles;
    });
  },
});

export default comparisonSlice.reducer;
