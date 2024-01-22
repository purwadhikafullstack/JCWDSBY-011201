import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    role: '',
    image: '',
    type: '',
  },
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.image = action.payload.image;
      state.type = action.payload.type;
    },
    logout: (state, action) => {
      state.name = '';
      state.email = '';
      state.role = '';
      state.image = '';
      state.type = '';
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
