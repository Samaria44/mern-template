import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slicers/authSlice";
import userSlice from "./Slicers/userSlice";
import entitySlice from "./Slicers/entitySlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    entity: entitySlice,
  },
});

export default store;
