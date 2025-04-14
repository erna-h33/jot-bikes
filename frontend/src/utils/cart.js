export const updateCart = (state, item) => {
  const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice = itemsPrice * 0.15;
  const totalPrice = itemsPrice + taxPrice;

  state.itemsPrice = itemsPrice;
  state.taxPrice = taxPrice;
  state.totalPrice = totalPrice;

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};
