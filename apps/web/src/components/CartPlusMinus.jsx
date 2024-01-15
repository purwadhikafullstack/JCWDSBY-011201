import React from 'react';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { decrementItem, incrementItem } from '../redux/slice/cartSlice';
export function CartPlusMinus(props) {
  const dispatch = useDispatch();
  return (
    <div className="my-1 w-16 h-7 flex border border-gray-300 rounded-lg items-center justify-around gap-x-2 ">
      <FiMinusCircle size={'24px'} onClick={() => {
          dispatch(decrementItem(props.cartId));
        }} />
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
