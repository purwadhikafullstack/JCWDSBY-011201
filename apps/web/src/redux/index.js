import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import storeReducer from './slice/storeSlice';
import AdminReducer from './slice/adminSlice';
import cartReducer from './slice/cartSlice';

const globalState = configureStore({
  reducer: {
    userReducer,
    storeReducer,
    AdminReducer,
    cartReducer
  },
});
export default globalState;
