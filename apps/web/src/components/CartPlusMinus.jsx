import React from 'react';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
export function CartPlusMinus(props) {
  return (
    <div className="my-1 xs:ms-16 w-16 h-7 flex border border-gray-300 rounded-lg items-center justify-around gap-x-2 ">
      <FiMinusCircle size={'24px'} />
      <p className="text-xs">{props.amount}</p>
      <FiPlusCircle size={'24px'} />
    </div>
  );
}
