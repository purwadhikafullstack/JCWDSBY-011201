import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import storeReducer from './slice/storeSlice';
import AdminReducer from './slice/adminSlice';

const globalState = configureStore({
  reducer: {
    userReducer,
    storeReducer,
    AdminReducer,
  },
});
export default globalState;
