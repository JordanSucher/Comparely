import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useParams } from "react-router-dom";

export const fetchData = createAsyncThunk("comparison/fetchData", async (comparisonId) => {
  try {
    const { data } = await axios.get(`/api/comparisons/${comparisonId}`);

    return data

  } catch (error) {
    console.log(`Error fetching data:`, error);
  }
})

export const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    id: null,
    text: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.text = action.payload;
    })
  }
})

export default comparisonSlice.reducer;
