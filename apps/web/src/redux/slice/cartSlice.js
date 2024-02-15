import { createSlice } from '@reduxjs/toolkit';
import API_CALL from '../../helpers/API';

const initialState = { items: [], freeItems: [], checkoutItems: [] };
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCarts: (state, action) => {
      state.items = action.payload;
    },
    setFreeItems: (state, action) => {
      state.freeItems = action.payload;
    },
    setCheckoutItems: (state, action) => {
      state.checkoutItems = action.payload;
    },
    incrementItem: (state, action) => {
      const itemInCart = state.items.find((item) => item.id === action.payload);
      if (itemInCart) {
        if (itemInCart.amount !== undefined) {
          itemInCart.amount++;
        }
      }
    },
    incrementFreeItem: (state, action) => {
      const itemInCart = state.freeItems.find(
        (item) => item.id === action.payload,
      );
      if (itemInCart) {
        if (itemInCart.amount !== undefined) {
          itemInCart.amount++;
        }
      }
    },
    decrementItem: (state, action) => {
      const itemInCart = state.items.find((item) => item.id === action.payload);
      if (itemInCart) {
        if (itemInCart.amount !== undefined && itemInCart.amount > 1) {
          itemInCart.amount--;
        } else if (itemInCart.amount !== undefined && itemInCart.amount === 1) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload,
          );
        }
      }
    },
    decrementFreeItem: (state, action) => {
      const itemInCart = state.freeItems.find(
        (item) => item.id === action.payload,
      );
      if (itemInCart) {
        if (itemInCart.amount !== undefined && itemInCart.amount > 1) {
          itemInCart.amount--;
        } else if (itemInCart.amount !== undefined && itemInCart.amount === 1) {
          state.freeItems = state.freeItems.filter(
            (item) => item.id !== action.payload,
          );
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
    checkUncheckAll: (state, action) => {
      state.items = state.items.map((item) => ({
        ...item,
        checked: action.payload,
      }));
    },
    deleteChecked: (state, action) => {
      state.items = state.items.filter((item) => item.checked === 0);
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
  checkUncheckAll,
  deleteChecked,
  setFreeItems,
  incrementFreeItem,
  decrementFreeItem,
  setCheckoutItems,
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
        dispatch(setFreeItems(response.data.freeItems));
      } catch (error) {
        console.log(error);
      }
    }
  };
};

export const UpdateAmountInCloud = (id, amount, storeUUID) => {
  return async (dispatch) => {
    try {
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

export const updateChecksInCloud = (cartId, checked, storeUUID) => {
  return async (dispatch) => {
    try {
      const response = await API_CALL.patch(
        `/cart/${cartId}?checker=true`,
        { checked },
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

export const updateChecksAllInCloud = (
  checkState,
  inventoryIdArray,
  storeUUID,
) => {
  return async (dispatch) => {
    try {
      if (inventoryIdArray) {
        const response = await API_CALL.patch(
          `/cart/checkall`,
          {
            checked: checkState,
            inventoryIdArray: inventoryIdArray,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        );
        dispatch(fetchCartItems(storeUUID));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const deleteCheckedItemInCloud = (inventoryIdArray, storeUUID) => {
  return async (dispatch) => {
    try {
      if (inventoryIdArray) {
        const response = await API_CALL.delete(`/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`authToken`)}`,
          },
          data: { inventoryIdArray },
        });
        dispatch(fetchCartItems(storeUUID));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
