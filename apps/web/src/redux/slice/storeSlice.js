import { createSlice } from '@reduxjs/toolkit';

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    storeId: '',
    storeName: undefined,
    address: '',
    postalCode: '',
    district: '',
    city: '',
    province: '',
    distance: '',
    lat: '',
    lon: '',
  },
  reducers: {
    setStore: (state, action) => {
      state.storeId = action.payload.UUID;
      state.storeName = action.payload.name;
      state.address = action.payload.address;
      state.postalCode = action.payload.postalCode;
      state.province = action.payload.province;
      state.city = action.payload.city;
      state.district = action.payload.district;
      state.distance = action.payload.distance;
      state.lat = action.payload.lat;
      state.lon = action.payload.lon;
    },
  },
});

export const { setStore } = storeSlice.actions;
export default storeSlice.reducer;
