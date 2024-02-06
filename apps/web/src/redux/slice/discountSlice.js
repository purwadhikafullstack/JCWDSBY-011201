import { createSlice } from '@reduxjs/toolkit';
import API_CALL from '../../helpers/API';

const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    id: '',
    storeId: '',
    inventoryId: '',
    name: '',
    term: '',
    type: '',
    limit: '',
    minTransaction: '',
    nominal: '',
    percentage: '',
    voucherCode: '',
    startTime: '',
    endTime: '',
  },
  reducers: {
    setDiscountData: (state, action) => {
      state.id = action.payload.id,
        state.storeId = action.payload.storeId,
        state.inventoryId = action.payload.inventoryId,
        state.name = action.payload.name,
        state.term = action.payload.term,
        state.type = action.payload.type,
        state.limit = action.payload.limit,
        state.minTransaction = action.payload.minTransaction,
        state.nominal = action.payload.nominal,
        state.percentage = action.payload.percentage,
        state.voucherCode = action.payload.voucherCode,
        state.startTime = action.payload.startTime,
        state.endTime = action.payload.endTime
    },
    clearDiscountData: (state) => {
      for (const key in state) {
        state[key] = false;
        // if(key.includes('error')){
        //   state[key] = false;
        // }else {
        //   state[key] = '';
        // }
      }
    },
    onChangeDiscountTerm: (state, action) => {
      state.term = action.payload
    },
    onChangeDiscountName: (state, action) => {
      state.name = action.payload
    },
    onChangeDiscountStore: (state, action) => {
      state.storeId = action.payload
    },
    onChangeDiscountProduct: (state, action) => {
      state.inventoryId = action.payload
    },
    onChangeDiscountStartTime: (state, action) => {
      state.startTime = action.payload
    },
    onChangeDiscountEndTime: (state, action) => {
      state.endTime = action.payload
    },
    onChangeDiscountType: (state, action) => {
      state.type = action.payload
    },
    onChangeDiscountPercentage: (state, action) => {
      state.percentage = action.payload
    },
    onChangeDiscountNominal: (state, action) => {
      state.nominal = action.payload
    },
    onChangeDiscountMinTransaction: (state, action) => {
      state.minTransaction = action.payload
    },
    onChangeVoucherCode: (state, action) => {
      state.voucherCode = action.payload
    },
    onChangeDiscountLimit: (state, action) => {
      state.limit = action.payload
    },
    // setErrorName: (state, action) => {
    //   state.errorName = action.payload
    // }
  }
})

export const {
  setDiscountData,
  onChangeDiscountTerm,
  onChangeDiscountName,
  onChangeDiscountStore,
  onChangeDiscountProduct,
  onChangeDiscountStartTime,
  onChangeDiscountEndTime,
  onChangeDiscountType,
  onChangeDiscountPercentage,
  onChangeDiscountNominal,
  onChangeDiscountMinTransaction,
  onChangeVoucherCode,
  onChangeDiscountLimit,
  clearDiscountData,
} = discountSlice.actions;
export default discountSlice.reducer;

export const fetchDiscountData = (UUID) => {
  return async (dispatch) => {
    try {
      const result = await API_CALL.get('discount', {
        params: {
          UUID
        },
      });
      dispatch(setDiscountData({ ...result.data.result.rows[0], storeId: result.data.result.rows[0].storeUUID }))

    } catch (error) {
      console.error(error);
    }
  };
};

export const updateDiscount = (updateData) => {
  return async (dispatch) => {
    try {
      // if (updateData.errorName) return dispatch(setErrorName(true))
      const discountId = updateData.id;
      let data = { ...updateData }
      delete data.id;
      if (data.term === 'buy 1 get 1') {
        data.type = null;
        data.percentage = null;
        data.nominal = null;
        data.limit = null;
        data.voucherCode = null;
      }
      if (data.term === 'product') {
        data.voucherCode = null;
        data.limit = null;
        if (data.type === 'percentage') data.nominal = null;
        if (data.type === 'nominal') data.percentage = null;
      }
      if (data.term === 'min transaction') delete data.inventoryId

      const store = await API_CALL.get(`store/UUID/${data.storeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (store) {
        data.storeId = store.id;
        const res = await API_CALL.patch(`discount/${discountId}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        if (res) dispatch(clearDiscountData());
      }
    } catch (error) {
      console.error(error);
    }
  };
};