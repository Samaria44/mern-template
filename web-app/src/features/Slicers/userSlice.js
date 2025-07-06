import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user_name: "",
  avatar: "",
  gender: "",
  cellNo: "",
  email: "",
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserName: (state, action) => {
      state.user_name = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    setCellNo: (state, action) => {
      state.cellNo = action.payload;
    },
  },
});

export const { setAvatar, setUserName, setGender, setCellNo, setEmail } = user.actions;
export default user.reducer;
