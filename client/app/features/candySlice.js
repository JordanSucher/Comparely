import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchCandyAsync = createAsyncThunk('candy/fetchAll', async () => {
    const { data } = await axios.get('http://localhost:1337/api/candy')
    return data
})

export const candySlice = createSlice({
    name: 'candies',
    initialState: [],
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCandyAsync.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export const selectCandy = (state) => state.candies

export default candySlice.reducer