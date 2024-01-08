import React from 'react';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { CartProductLists } from '../components/CartProductLists';
import UserLayout from '../components/UserLayout';

const Cart = () => {
  const product = [
    {
      name: 'Daging Segar 5kg',
      price: 30000,
      amount: 1,
      selected: true,
      image:
        'https://www.astronauts.id/blog/wp-content/uploads/2023/05/Panduan-Lengkap-Memilih-Bagian-Daging-Sapi-untuk-Steak-yang-Lezat.jpg',
    },
    {
      name: 'Telur 6 butir',
      price: 20000,
      amount: 1,
      selected: false,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1sBaHYVLkzE3-2JbO5ctM96ejnmWSIQ3BbPKveLO43KebzvIlMHzf7Fx95Kqn_UK4Nv4&usqp=CAU',
    },
  ];

  return (
    <UserLayout>
      <div className="container mx-auto max-w-sm h-[100svh] font-roboto">
        <div className="flex tracking-tight justify-center mb-3 ">
          <h1 className="text-xl font-bold">Cart</h1>
        </div>
        <div>
          <div className="flex flex-col items-center mb-3">
            <hr className="h-px w-full sm:w-11/12 bg-black border-0 dark:bg-gray-700"></hr>
          </div>
          <CartProductLists arrays={product} />
        </div>
      </div>
    </UserLayout>
  );
};
export default Cart;
