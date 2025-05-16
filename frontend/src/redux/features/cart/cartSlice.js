import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../../../utils/cart.js';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], paymentMethod: 'Stripe' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      // Ensure vendor information is preserved
      const cartItem = {
        ...item,
        vendor: action.payload.vendor,
      };
      const existItem = state.cartItems.find((x) => x._id === cartItem._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) => (x._id === existItem._id ? cartItem : x));
      } else {
        state.cartItems = [...state.cartItems, cartItem];
      }
      return updateCart(state, cartItem);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state = initialState) => {},
  },
});

export const { addToCart, removeFromCart, savePaymentMethod, clearCartItems, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;
