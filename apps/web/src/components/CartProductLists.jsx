import React, { useEffect, useRef, useState } from 'react';
import { CartPlusMinus } from './CartPlusMinus';
import { Card, Checkbox } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkUncheckAll,
  deleteChecked,
  deleteCheckedItemInCloud,
  updateChecksAllInCloud,
  updateChecksInCloud,
} from '../redux/slice/cartSlice';
import { IndividualCartItems } from './IndividualCartItems';
import Skeleton from 'react-loading-skeleton';
import { CartSkeleton } from './cart/CartSkeleton';
import { FreeCartItems } from './FreeCartItems';
export function CartProductLists(props) {
  const [checkall, setCheckall] = useState(false);
  const [click, setClick] = useState(false);
  const cartItems = useSelector((state) => state.cartReducer.items);
  const freeItems = useSelector(state=>state.cartReducer.freeItems)
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  const dispatch = useDispatch();
  const prevCheckedRef = useRef(checkall);
  const [load, setLoad] = useState(true);
  const itemsInvId = cartItems.reduce((accu, item) => {
    accu.push(item.inventoryId);
    return accu;
  }, []);
  const checkedItemsInvId = cartItems.reduce((accu, item) => {
    if (item.checked === 1) {
      accu.push(item.inventoryId);
    }
    return accu;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);
  useEffect(() => {
    if (click) {
      dispatch(updateChecksAllInCloud(Number(checkall), itemsInvId, storeUUID));
      setClick(false);
    }
    // const timer = setTimeout(() => {
    // }, 300);
    // return () => clearTimeout(timer);
  }, [checkall, storeUUID]);

  const checkAllHandler = () => {
    setCheckall(!checkall);
    dispatch(checkUncheckAll(Number(!checkall)));
  };
  return (
    <Card className="max-w-sm sm:max-w-full max-h-96 sm:max-h-[800px] ">
      <div className=" flex items-center justify-between">
        <div className="flex gap-x-3">
          <Checkbox
            checked={checkall}
            onChange={checkAllHandler}
            onClick={() => setClick(true)}
            className="!w-4 !h-4"
          />
          <h5 className="text-md font-bold leading-none text-gray-900 dark:text-white">
            Pilih semua
          </h5>
        </div>
        {checkedItemsInvId?.length > 0 ? (
          <div
            className="font-bold sm:hover:text-blue-600 cursor-pointer"
            onClick={() => {
              dispatch(deleteChecked());
              dispatch(deleteCheckedItemInCloud(checkedItemsInvId, storeUUID));
            }}
          >
            Hapus
          </div>
        ) : (
          <div className="h-6"></div>
        )}
      </div>
      {load ? (
        <CartSkeleton />
      ) : (
        <div className='flex flex-col gap-y-4'>
          {props.arrays.map((val, idx) => (
            <IndividualCartItems
              val={val}
              key={idx}
              checkall={checkall}
              setCheckallFalse={setCheckall}
            />
          ))}
          {freeItems?.length>0?<span className='capitalize'>free</span>:null}
           {freeItems.map((val, idx) => (
            <FreeCartItems
              val={val}
              key={idx}
              checkall={checkall}
              setCheckallFalse={setCheckall}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
