import React from 'react';
import UserLayout from '../components/UserLayout';
import { Card } from 'flowbite-react';
const Checkout = () => {
  return (
    <UserLayout>
      <div className="container mx-auto max-w-sm h-[100svh] font-roboto overflow-y-auto bg-gray-100">
        <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm">
          <p className="font-semibold">rincian pesanan</p>
          <div className='bg-gradient-to-b from-blue-400 to-white border w-full h-32 rounded-md'></div>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Checkout;
