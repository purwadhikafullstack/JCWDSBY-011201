import React from 'react';
import { Button } from 'flowbite-react';
import CartContainer from '../components/cart/CartContainer';
export function CheckoutRightSide({
  showSnap,
  cartItems,
  selectedCourier,
  handlePay,
  itemTotal,
  paymentTotal
}) {
  return (
    <div className="flex relative lg:h-64 lg:w-4/12 ">
      <CartContainer
        className={` ${
          showSnap ? `hidden` : 'flex'
        } mt-3 p-3 flex-col rounded-md lg:sticky w-full lg:w-96 lg:top-0`}
      >
        <div className="flex flex-row md:flex-col justify-between md:gap-y-4">
          <div className=" hidden lg:flex  flex-col rounded-none capitalize mb-3 gap-y-2">
            <p className="font-bold text-base mb-2">ringkasan belanja</p>
            <div className="flex justify-between">
              <p className=" text-sm">
                Total Harga ({cartItems?.length} barang)
              </p>
              <p className=" text-sm">
                Rp {(itemTotal || 0).toLocaleString('id-ID')}
              </p>
            </div>
            {selectedCourier && (
              <div className="flex justify-between">
                <p className=" text-sm">Total Ongkos Kirim</p>
                <p className=" text-sm">
                  Rp {(selectedCourier?.price || 0).toLocaleString('id-ID')}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col lg:flex-row justify-between font-bold">
            <p className="">Total Belanja</p>
            <p className="">Rp {(paymentTotal || 0).toLocaleString('id-ID')}</p>
          </div>
          <Button onClick={handlePay} color="blue">
            Checkout
          </Button>
        </div>
      </CartContainer>
    </div>
  );
}
