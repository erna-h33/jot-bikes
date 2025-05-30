import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { _id, username, name, email, isAdmin, isVendor, token } = action.payload;
      state.userInfo = {
        _id,
        name: name || username, // Use name if available, otherwise use username
        email,
        isAdmin,
        isVendor,
        token,
      };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
