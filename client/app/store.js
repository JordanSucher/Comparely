import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/Account/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
export * from "../components/Account/authSlice";
