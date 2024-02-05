import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
const CartPlusMinusNoFunc = (props) => {
  return (
    <div className="my-1 w-24 h-8 flex border border-gray-300 rounded-lg items-center justify-around gap-x-1 relative left-8 sm:left-0 ">
      <FaMinus
        size={'16px'}
        className="text-blue-600"
        onClick={props.onclickminus}
      />
      <span className="text-sm">{props.amountstate}</span>
      {props.amountstate < props.stock ? (
        <FaPlus
          size={'16px'}
          className="text-blue-600"
          onClick={props.onclickplus}
        />
      ) : (
        <FaPlus size={'16px'} className="text-gray-500" />
      )}
    </div>
  );
};

export default CartPlusMinusNoFunc;
