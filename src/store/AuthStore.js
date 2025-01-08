import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: !!localStorage.getItem('email'),
  token: null,
  email: localStorage.getItem("email"),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.email = null;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
    },
  },
});

export const authActions=authSlice.actions;
export default authSlice.reducer;
