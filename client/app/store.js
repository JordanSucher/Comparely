import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Account/authSlice";
import comparisonReducer from "../features/ComparisonComponents/comparisonSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    comparison: comparisonReducer,
  },
});

export default store;
export * from "../features/Account/authSlice";
export * from "../features/ComparisonComponents/comparisonSlice";
