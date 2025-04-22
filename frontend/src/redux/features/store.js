import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { apiSlice } from '../api/apiSlice';
import { feedbackApiSlice } from '../api/feedbackApiSlice';
import authReducer from '../features/auth/authSlice';
import cartSliceReducer from '../features/cart/cartSlice';
import shopReducer from '../features/shop/shopSlice';
import { userDetailsReducer } from '../reducers/userReducer';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [feedbackApiSlice.reducerPath]: feedbackApiSlice.reducer,
    auth: authReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
    userDetails: userDetailsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, feedbackApiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export default store;
