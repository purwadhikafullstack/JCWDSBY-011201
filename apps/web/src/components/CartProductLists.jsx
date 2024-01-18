import React, { useEffect } from 'react';
import { CartPlusMinus } from './CartPlusMinus';
import { Card, Checkbox } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateChecksInCloud } from '../redux/slice/cartSlice';
import { IndividualCartItems } from './IndividualCartItems';
export function CartProductLists(props) {
  return (
    <Card className="max-w-md max-h-72 sm:max-h-screen overflow-y-auto">
      <div className=" flex items-center justify-between">
        <div className="flex gap-x-3">
          <Checkbox className="!w-4 !h-4" />
          <h5 className="text-md font-bold leading-none text-gray-900 dark:text-white">
            Pilih semua
          </h5>
        </div>
        <div className='font-bold sm:hover:text-blue-600'>
          Hapus
        </div>
      </div>
      {props.arrays.map((val, idx) => (
        <IndividualCartItems val={val} key={idx} />
      ))}
    </Card>
  );
}
