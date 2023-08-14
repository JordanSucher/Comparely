import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Account/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
export * from "../features/Account/authSlice";
