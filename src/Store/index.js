import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/postSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
  },
});
