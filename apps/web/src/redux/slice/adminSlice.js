import { createSlice } from '@reduxjs/toolkit';

const AdminSlice = createSlice({
  name: 'changePasswordAdmin',
  initialState: {
    uuid: '',
    name: '',
    email: '',
  },
  reducers: {
    edit: (state, action) => {
      state.uuid = action.payload.uuid;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clear: (state) => {
      state.uuid = '';
      state.name = '';
      state.email = '';
    },
  },
});

export const { edit, clear } = AdminSlice.actions;
export const editAdminData = (state) => state.AdminReducer;
export default AdminSlice.reducer;
