import React, { useEffect, useRef } from 'react';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  UpdateAmountInCloud,
  decrementItem,
  incrementItem,
} from '../redux/slice/cartSlice';
export function CartPlusMinus(props) {
  const dispatch = useDispatch();
  const storeUUID = useSelector((state) => state.storeReducer.storeId)
  const latestAmountRef = useRef(props.amount);
  useEffect(() => {
    latestAmountRef.current = props.amount;
    const timer = setTimeout(() => {
      dispatch(UpdateAmountInCloud(props.cartId, latestAmountRef.current,storeUUID));
    }, 1000);
    return () => clearTimeout(timer);
  }, [props.amount]);

  return (
    <div className="my-1 w-16 h-7 flex border border-gray-300 rounded-lg items-center justify-around gap-x-2 ">
      <FiMinusCircle
        size={'24px'}
        onClick={() => {
          dispatch(decrementItem(props.cartId));
        }}
      />
      <p className="text-xs">{props.amount}</p>
      <FiPlusCircle
        size={'24px'}
        onClick={() => {
          dispatch(incrementItem(props.cartId));
          
        }}
      />
    </div>
  );
}
