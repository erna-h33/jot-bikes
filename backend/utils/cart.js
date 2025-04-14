export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate the total price of the items in the cart
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.price * item.qty, 0)
  );

  state.taxPrice = addDecimals(state.itemsPrice * 0.1);

  state.totalPrice = (Number(state.itemsPrice) + Number(state.taxPrice)).toFixed(2);

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};
