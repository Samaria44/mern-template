import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/Slicers/authSlice";
import userSlice from "./features/Slicers/userSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
  },
});


export default store;
