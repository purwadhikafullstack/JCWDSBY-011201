import { createSlice } from '@reduxjs/toolkit';
import API_CALL from '../../helpers/API';

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
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;

//Middleware
export const keepLogin = () => {
  return async (dispatch) => {
    try {
      if (!localStorage.getItem('authToken')) {
        throw 'Tokens not found';
      }
      const result = await API_CALL.get('/auth/keep-login', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const { name, email, role, image, type } = result.data.result;
      dispatch(login(result.data.result));
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };
};
