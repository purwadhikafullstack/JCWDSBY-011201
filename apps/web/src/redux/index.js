import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import storeReducer from './slice/storeSlice';
const globalState = configureStore({
  reducer: {
    userReducer,
    storeReducer,
  },
});
export default globalState;
