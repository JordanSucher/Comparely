import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getData = createAsyncThunk("comparison/getData", async () => {
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
    builder.addCase(getData.fulfilled, (state, action) => {
      state.text = action.payload;
    })
  }
})

export default comparisonSlice.reducer;
