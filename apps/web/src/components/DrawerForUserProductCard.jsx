import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import CartPlusMinusNoFunc from './CartPlusMinusNoFunc';
import { Button } from 'flowbite-react';
import API_CALL from '../helpers/API';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems } from '../redux/slice/cartSlice';
import ButtonWithLoading from './ButtonWithLoading';
import customToast from '../utils/toast';

export function DrawerForUserProductCard({
  openDrawer,
  toggleDrawer,
  image,
  productName,
  price,
  inventoryid,
  stock,
  discountPrice,
}) {
  console.log('🚀 ~ inventoryid:', inventoryid);
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  const onHandleSubmitAddToCart = async (inventoryid, amount, storeUUID) => {
    try {
      setIsLoading(true);
      if (inventoryid) {
        const response = await API_CALL.post(
          '/cart',
          {
            inventoryId: inventoryid,
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        );
        console.log(
          '🚀 ~ onHandleSubmitAddToCart ~ response:',
          response.data.success,
        );
        dispatch(fetchCartItems(storeUUID));
        customToast(response.data.success, response.data.message);
        setIsLoading(false);
        toggleDrawer(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <Drawer
      open={openDrawer}
      onClose={toggleDrawer}
      direction="bottom"
      className=" w-full sm:max-w-xl !min-h-[49vh] sm:h-72 mx-auto shadow-inner shadow-blue-500 rounded-t-lg p-5"
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
            {discountPrice && (
              <p className="line-through text-sm text-red-500">
                {(price * amount).toLocaleString('ID', {
                  style: 'currency',
                  currency: 'idr',
                })}
              </p>
            )}
            <div>
              <p className="font-semibold text-xl">
                {(discountPrice || price * amount).toLocaleString('ID', {
                  style: 'currency',
                  currency: 'idr',
                })}
              </p>
            </div>
          </div>
          <CartPlusMinusNoFunc
            amountstate={amount}
            stock={stock}
            onclickminus={() => {
              if (amount > 1) {
                setAmount((prev) => prev - 1);
              }
            }}
            onclickplus={() => {
              if (amount < stock) {
                setAmount((prev) => prev + 1);
              }
            }}
          />
        </div>
        <ButtonWithLoading
          func={() => {
            onHandleSubmitAddToCart(inventoryid, amount, storeUUID);
          }}
          isLoading={isLoading}
        >
          Tambah ke Keranjang
        </ButtonWithLoading>
      </div>
    </Drawer>
  );
}
