import { Checkbox } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { CartPlusMinus } from './CartPlusMinus';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkUncheckItem,
  updateChecksInCloud,
} from '../redux/slice/cartSlice';
export function IndividualCartItems({ val, idx, checkall, setCheckallFalse }) {
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  const prevCheckedRef = useRef(val.checked);
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  console.log(val);
  useEffect(() => {
    if (val.checked !== prevCheckedRef.current && clicked) {
      prevCheckedRef.current = val.checked;
      const timer = setTimeout(() => {
        dispatch(
          updateChecksInCloud(val.id, prevCheckedRef.current, storeUUID),
        );
      }, 300);
      setClicked(false);
      return () => clearTimeout(timer);
    }
  }, [val.checked, storeUUID, val.id]);
  return (
    <div className="w-full h-15 justify-start items-start gap-2 flex">
      <div className="flex">
        <Checkbox
          className="!w-4 !h-4"
          checked={val.checked}
          onChange={() => {
            dispatch(checkUncheckItem(val.id));
          }}
          onClick={() => {
            setClicked(true);
            if (checkall) {
              setCheckallFalse(false);
            }
          }}
        />
      </div>
      <div className="justify-start items-start gap-1 flex w-full">
        <div className=" rounded justify-center items-center flex">
          <img className="w-12 h-10 object-cover" src={val.imageLink} />
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
              buy 1 get 1
              </div>
            </div>
          )}
          <div className="flex flex-row justify-start items-start gap-1 w-full ">
            {val.discountType && val.discountType !== 'buy 1 get 1' && (
              <div className="text-zinc-500 text-xs font-light  line-through">
                Rp{(val.productPrice * val.amount).toLocaleString('id-ID')}
              </div>
            )}
            {val.discountType &&
              val.discountType === 'buy 1 get 1' &&
              val.amount > 1 && (
                <div className="text-zinc-500 text-xs font-light  line-through">
                  Rp{(val.productPrice * val.amount).toLocaleString('id-ID')}
                </div>
              )}
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
          <CartPlusMinus amount={val.amount} cartId={val.id} />
        </div>
      </div>
    </div>
  );
}
