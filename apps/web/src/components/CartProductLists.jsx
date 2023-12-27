import React from 'react';
import { CartPlusMinus } from './CartPlusMinus';
import { Card, Checkbox } from 'flowbite-react';
export function CartProductLists(props) {
  return (
    <Card className="max-w-md">
      <div className=" flex items-center justify-between">
        <div className="flex gap-x-3">
          <Checkbox className="!w-4 !h-4" />
          <h5 className="text-md font-bold leading-none text-gray-900 dark:text-white">
            Pilih semua
          </h5>
        </div>
      </div>
      {props.arrays.map((val, idx) => (
        <div
          key={idx}
          className="w-full h-15 justify-start items-start gap-2 flex"
        >
          <div className="flex">
            <Checkbox
              className="!w-4 !h-4"
              defaultChecked={val.selected ? true : false}
            />
          </div>
          <div className="justify-start items-start gap-1 flex">
            <div className=" rounded justify-center items-center flex">
              <img className="w-16 h-10 object-cover" src={val.image} />
            </div>
            <div className="flex-col justify-start items-start text-start gap-4 flex w-full">
              <div className="flex-col flex">
                <div className="text-black text-sm  ">{val.name}</div>
              </div>
              <div className="flex justify-start items-start gap-1 w-full ">
                <div className="p-1 bg-rose-500 rounded justify-center items-center gap-1 flex">
                  <div className="text-white text-[8px] font-light ">19%</div>
                </div>
                <div className="text-zinc-500 text-xs font-light  line-through">
                  Rp5.500
                </div>
                <div className="text-black text-sm font-bold ">
                  Rp{val.price.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
          <div className="sm:ml-12">
            <CartPlusMinus amount={val.amount} />
          </div>
        </div>
      ))}
    </Card>
  );
}
