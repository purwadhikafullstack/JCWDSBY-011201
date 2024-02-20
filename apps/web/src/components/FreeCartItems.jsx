import { Checkbox } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { CartPlusMinus } from './CartPlusMinus';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkUncheckItem,
  updateChecksInCloud,
} from '../redux/slice/cartSlice';
export function FreeCartItems({ val, idx, checkall, setCheckallFalse }) {
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  const prevCheckedRef = useRef(val.checked);
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  return (
    <div
      className={`w-full h-15 ${
        val.checked ? '' : 'bg-gray-200'
      }    justify-start items-start gap-2 flex`}
    >
      <div className="flex w-4"></div>
      <div className="justify-start items-start gap-1 flex w-full">
        <div className=" rounded justify-center items-center flex">
          <img
            className="w-12 lg:w-20 h-12 lg:h-20 object-cover"
            src={val.imageLink}
          />
        </div>
        <div className="flex-col  items-start text-start gap-y-2 flex w-full">
          <div className="flex-col flex">
            <div className="text-black text-xs sm:text-sm capitalize  ">
              {val.productName}
            </div>
          </div>
          {val.discountPercentage && (
            <div
              className={`p-1 bg-rose-500 rounded justify-center items-center gap-1 flex`}
            >
              <div className="text-white text-[10px] font-light ">
                - {val.discountPercentage * 100}%
              </div>
            </div>
          )}
          {val.discountNominal && (
            <div
              className={`p-1 bg-rose-500 rounded justify-center items-center gap-1 flex`}
            >
              <div className="text-white text-[10px] font-light ">
                - Rp {val.discountNominal}
              </div>
            </div>
          )}
          {(val.discountTerm === 'buy 1 get 1' || val.hasFreeItem) && (
            <div
              className={`p-1 bg-rose-500 rounded justify-center items-center gap-1 flex`}
            >
              <div className="text-white text-[10px] font-light capitalize">
                free item
              </div>
            </div>
          )}
          <div className="flex flex-row justify-start items-start gap-1 w-full ">
            <div className="flex w-full">
              <div className="text-black text-xs font-bold w-6/12 ">
                Rp
                {(val.discountedPrice
                  ? val.discountedPrice * val.amount ||
                    val.productPrice * val.amount -
                      Math.ceil(val.amount / 2) * val.productPrice
                  : val.productPrice * val.amount
                ).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:ml-12 w-6/12 self-center">
          <div className="my-1 w-20 h-7 flex border border-gray-300 rounded-lg items-center justify-around gap-x-1 relative left-8 sm:left-0 ">
            <span className="text-xs">{val.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
