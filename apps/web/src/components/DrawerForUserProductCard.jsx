import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import CartPlusMinusNoFunc from './CartPlusMinusNoFunc';
import { Button } from 'flowbite-react';

export function DrawerForUserProductCard({
  openDrawer,
  toggleDrawer,
  image,
  productName,
  price
}) {
  const [amount, setAmount] = useState(1);
  return (
    <Drawer
      open={openDrawer}
      onClose={toggleDrawer}
      direction="bottom"
      className=" w-full sm:max-w-xl max-h-72 mx-auto shadow-inner shadow-blue-500 rounded-t-lg p-5"
    >
      <div className="flex flex-col gap-y-3">
        <div className="w-full h-16 flex gap-x-6">
          <img
            className="w-16 h-16 object-cover"
            src={image}
            alt={productName}
          />
          <div className="font-semibold">{productName}</div>
        </div>
        <p className="font-semibold w-36">Pilih Jumlah</p>
        <div className="flex w-72 sm:w-full justify-between items-center">
          <div className="flex flex-col">
            <p className="line-through text-sm">
              {(price * amount).toLocaleString('ID', {
                style: 'currency',
                currency: 'idr',
              })}
            </p>
            <div>
              <p className="font-semibold text-xl">
                {(price * amount).toLocaleString('ID', {
                  style: 'currency',
                  currency: 'idr',
                })}
              </p>
            </div>
          </div>
          <CartPlusMinusNoFunc
            amountstate={amount}
            onclickminus={() => {
              if (amount > 1) {
                setAmount((prev) => prev - 1);
              }
            }}
            onclickplus={() => {
              if (amount < 10) {
                setAmount((prev) => prev + 1);
              }
            }}
          />
        </div>
        <Button>Tambah ke Keranjang</Button>
      </div>
    </Drawer>
  );
}
