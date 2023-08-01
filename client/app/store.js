import { configureStore } from "@reduxjs/toolkit";
import candyReducer from './features/candySlice'

export const store = configureStore({
  reducer: {
    candies: candyReducer,
  },
});
