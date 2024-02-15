import React, { useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';
import {
  UpdateAmountInCloud,
  decrementFreeItem,
  decrementItem,
  incrementFreeItem,
  incrementItem,
} from '../redux/slice/cartSlice';
import API_CALL from '../helpers/API';
export function CartPlusMinus(props) {
  const dispatch = useDispatch();
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  const latestAmountRef = useRef(props.amount);
  useEffect(() => {
    latestAmountRef.current = props.amount;
    const timer = setTimeout(() => {
      dispatch(
        UpdateAmountInCloud(props.cartId, latestAmountRef.current, storeUUID),
      );
    }, 800);
    return () => clearTimeout(timer);
  }, [props.amount]);

  const deleteItem = async (cartId) => {
    try {
      const response = await API_CALL.delete(`/cart/delete/${cartId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="my-1 w-20 h-7 flex border border-gray-300 rounded-lg items-center justify-around gap-x-1 relative left-8 md:left-0 ">
      {props.amount < 2 ? (
        <FaMinus
          size={'16px'}
          className="text-gray-600"
          onClick={() => {
            deleteItem(props.cartId);
            dispatch(decrementItem(props.cartId));
          }}
        />
      ) : (
        <FaMinus
          size={'16px'}
          className="text-blue-600"
          onClick={() => {
            dispatch(decrementItem(props.cartId));
            dispatch(decrementFreeItem(props.cartId));
          }}
        />
      )}
      <span className="text-xs">{props.amount}</span>
      <FaPlus
        size={'16px'}
        className="text-blue-600"
        onClick={() => {
          dispatch(incrementItem(props.cartId));
          dispatch(incrementFreeItem(props.cartId));
        }}
      />
    </div>
  );
}
