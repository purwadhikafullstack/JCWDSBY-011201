import React from 'react';
import UserLayout from '../components/UserLayout';
import { Button, Card } from 'flowbite-react';
import CartContainer from '../components/cart/CartContainer';
const Checkout = () => {
  return (
    <UserLayout>
      <div className="container mx-auto max-w-sm h-[100vh] font-roboto overflow-y-auto bg-gray-100 ">
        <div className="flex flex-col">
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <p className="font-semibold">pilih waktu pengiriman</p>
          </Card>
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <p className="font-semibold">rincian pesanan</p>
            <div className="bg-gradient-to-b from-blue-400 to-white border w-full h-32 rounded-md"></div>
          </Card>
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <p className="font-semibold">metode pembayaran</p>
          </Card>
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <p className="font-semibold">ringkasan pembayaran</p>
          </Card>
        </div>
        <CartContainer className="mt-3 p-3 flex-col rounded-md fixed w-full sm:w-64 top-[72vh] sm:right-36 sm:top-36">
        <div className="flex flex-row justify-between">
          <p>
            Total:{' '}
            <span className="font-bold">
              {/* Rp{totalPrice.toLocaleString('id-ID')} */}
              Rp50000
            </span>
          </p>
          <Button color="blue">Checkout</Button>
        </div>
      </CartContainer>
      </div>
    </UserLayout>
    
  );
};

export default Checkout;
