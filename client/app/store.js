import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Account/authSlice";
import comparisonReducer from "../features/Comparison/ComparisonSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    compare: comparisonReducer,
  },
});

export default store;
export * from "../features/Account/authSlice";
