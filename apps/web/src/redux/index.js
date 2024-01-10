import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import AdminReducer from './slice/adminSlice';
const globalState = configureStore({
  reducer: {
    userReducer,
    AdminReducer,
  },
});
export default globalState;
