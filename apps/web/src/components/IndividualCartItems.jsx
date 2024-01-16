import { Checkbox } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { CartPlusMinus } from './CartPlusMinus';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkUncheckItem,
  updateChecksInCloud,
} from '../redux/slice/cartSlice';
export function IndividualCartItems({ val, idx }) {
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  const prevCheckedRef = useRef(val.checked);
  const dispatch = useDispatch();
  useEffect(() => {
    if (val.checked !== prevCheckedRef.current) {
      const timer = setTimeout(() => {
        dispatch(
          updateChecksInCloud(
            val.id,
            storeUUID,
          ),
        );
      }, 1000);
      prevCheckedRef.current = val.checked;
      return () => clearTimeout(timer);
    }
  }, [val.checked]);
  return (
    <div className="w-full h-15 justify-start items-start gap-2 flex">
      <div className="flex">
        <Checkbox
          className="!w-4 !h-4"
          defaultChecked={val.checked ? true : false}
          onClick={() => {
            dispatch(checkUncheckItem(val.id));
          }}
        />
      </div>
      <div className="justify-start items-start gap-1 flex">
        <div className=" rounded justify-center items-center flex">
          <img className="w-16 h-10 object-cover" src={val.imageLink} />
        </div>
        <div className="flex-col justify-start items-start text-start gap-2 flex w-full">
          <div className="flex-col flex">
            <div className="text-black text-sm capitalize  ">
              {val.productName}
            </div>
          </div>
          <div className="flex justify-start items-start gap-1 w-full ">
            <div className="p-1 bg-rose-500 rounded justify-center items-center gap-1 flex">
              <div className="text-white text-[8px] font-light ">19%</div>
            </div>
            <div className="text-zinc-500 text-xs font-light  line-through">
              Rp5.500
            </div>
            <div className="text-black text-sm font-bold ">
              Rp{val.productPrice.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:ml-12">
        <CartPlusMinus amount={val.amount} cartId={val.id} />
      </div>
    </div>
  );
}
