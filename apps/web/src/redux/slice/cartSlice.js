import { createSlice } from '@reduxjs/toolkit';
import API_CALL from '../../helpers/API';

const initialState = { items: [], dataToCheckout: {} };
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCarts: (state, action) => {
      state.items = action.payload;
    },
    incrementItem: (state, action) => {
      const itemInCart = state.items.find((item) => item.id === action.payload);
      if (itemInCart) {
        if (itemInCart.amount !== undefined) {
          itemInCart.amount++;
        }
      }
    },
    decrementItem: (state, action) => {
      const itemInCart = state.items.find((item) => item.id === action.payload);
      if (itemInCart) {
        if (itemInCart.amount !== undefined && itemInCart.amount > 0) {
          itemInCart.amount--;
        }
      }
    },
    checkUncheckItem: (state, action) => {
      const itemInCart = state.items.find((item) => item.id === action.payload);
      if (itemInCart) {
        if (itemInCart.checked > 0) {
          itemInCart.checked = 0;
        } else {
          itemInCart.checked = 1;
        }
      }
    },
    cartToCheckout: (state, action) => {
      state.dataToCheckout = action.payload.dataToCheckout;
    },
  },
});

export const {
  setCarts,
  cartToCheckout,
  incrementItem,
  decrementItem,
  checkUncheckItem,
} = cartSlice.actions;
export default cartSlice.reducer;

export const fetchCartItems = (storeUUID) => {
  return async (dispatch) => {
    if (storeUUID) {
      try {
        const response = await API_CALL.get(`/cart?UUID=${storeUUID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
       
        dispatch(setCarts(response.data.data));
        console.log("🚀 ~ return ~ response:", response.data)
      } catch (error) {
        console.log(error);
      }
       
    }
  };
};

export const UpdateAmountInCloud = (id, amount, storeUUID) => {
  return async (dispatch) => {
    try {
      console.log(amount);
      const response = await API_CALL.patch(
        `/cart/${id}`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      dispatch(fetchCartItems(storeUUID));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateChecksInCloud = (cartId,checked,storeUUID) => {
  return async (dispatch) => {
    console.log("checkMonitor",checked);
    try {
      const response = await API_CALL.patch(
        `/cart/${cartId}?checker=true`,
        {checked},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      dispatch(fetchCartItems(storeUUID));
    } catch (error) {
      console.log(error);
    }
  };
};
