import React from 'react';
import { Card, Checkbox } from 'flowbite-react';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { CartPlusMinus } from '../component/CartPlusMinus';

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
    <div>
      <div className="flex tracking-tight justify-between mb-3 ">
        <MdOutlineArrowBackIos size={25} className={'hover:cursor-pointer'} />
        <h1 className="text-xl font-bold">Keranjang</h1>
        <div></div>
      </div>
      <div>
        <div className="flex flex-col items-center mb-3">
          <hr className="h-px w-full sm:w-11/12 bg-black border-0 dark:bg-gray-700"></hr>
        </div>
        <Card className="max-w-md">
          <div className=" flex items-center justify-between">
            <div className="flex gap-x-3">
              <Checkbox className="!w-4 !h-4" />
              <h5 className="text-md font-bold leading-none text-gray-900 dark:text-white">
                Pilih semua
              </h5>
            </div>
          </div>
          {product.map((val, idx) => (
            <div className="w-full h-15 justify-start items-start gap-2 flex">
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
                    <div className="text-black text-sm  ">
                      {val.name}
                    </div>
                  </div>
                  <div className="flex justify-start items-start gap-1 w-full ">
                    <div className="p-1 bg-rose-500 rounded justify-center items-center gap-1 flex">
                      <div className="text-white text-[8px] font-light ">
                        19%
                      </div>
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
              <div className='sm:ml-12'>
                <CartPlusMinus amount={val.amount} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
export default Cart;
