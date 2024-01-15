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
    // addToCart: (state, action) => {
    //   const itemInCart = state.items.find(
    //     (item) => item.inventoryId === action.payload.inventoryId,
    //   );
    //   if (itemInCart) {
    //     if (itemInCart.amount!==undefined) {
    //       itemInCart.amount++
    //     }
    //   }else {
    //     state.items.push({...action.payload, amount: 1})
    //   }
    // },
    incrementItem: (state, action) => {
      const itemInCart = state.items.find(
        (item) => item.id === action.payload,
      );
      if (itemInCart) {
        if (itemInCart.amount !== undefined) {
          itemInCart.amount++;
        }
      }
    },
    decrementItem: (state, action) => {
      const itemInCart = state.items.find(
        (item) => item.id === action.payload,
      );
      if (itemInCart) {
        if (itemInCart.amount !== undefined && itemInCart.amount > 0) {
          itemInCart.amount--;
        }
      }
    },
    checkUncheckItem: (state, action) => {
      const itemInCart = state.items.find(
        (item) => item.id === action.payload,
      );
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

export const fetchCartItems = () => {
  return async (dispatch) => {
    try {
      const response = await API_CALL.get(`/cart?storeId=${1}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      // console.log(response.data.data);
      dispatch(setCarts(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateAmountInCloud = (id) => {
  return async(dispatch) => {
    try {
      const response = await API_CALL.post(`/cart/${id}`,)
    } catch (error) {
      console.log(error);
    }
  }
};
