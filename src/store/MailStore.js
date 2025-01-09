import { createSlice } from "@reduxjs/toolkit";

const initialMailStoreState = {
  mailStoreList: [],
  unReadMailCount: 0,
};

const mailStoreSlice = createSlice({
  name: "mailStore",
  initialState: initialMailStoreState,
  reducers: {
    setMailStoreList: (state, action) => {
      state.mailStoreList = action.payload;
    },
    setUnReadMailCount: (state, action) => {
      state.unReadMailCount = action.payload;
    },
  },
});

export const mailStoreActions = mailStoreSlice.actions;
export default mailStoreSlice.reducer;
