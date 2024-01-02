import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
const globalState = configureStore({
  reducer: {
    userReducer,
  },
});
export default globalState;
