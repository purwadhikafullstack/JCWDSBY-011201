import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [], dataToCheckout: {} };
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCarts: (state, action) => (state.items = action.payload.items),
    cartToCheckout: (state, action) =>
      (state.dataToCheckout = action.payload.dataToCheckout),
  },
});

export const { setCarts, cartToCheckout } = cartSlice.actions;
export default cartSlice.reducer;
