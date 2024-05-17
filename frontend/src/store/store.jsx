import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../slices/apiSlice";
import authReducer from "../slices/userSlices/authSlices.js";
import adminAuthSlices from "../slices/adminSlices/adminAuthSlices.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthSlices,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
