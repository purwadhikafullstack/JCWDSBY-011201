import React, { useEffect } from 'react';
import { CartProductLists } from '../components/CartProductLists';
import UserLayout from '../components/UserLayout';
import CartContainer from '../components/cart/CartContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import { fetchCartItems, setCarts } from '../redux/slice/cartSlice';

const Cart = () => {
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartReducer.items);
  console.log("🚀 ~ Cart ~ cartItems:", cartItems)
  useEffect(() => {
    dispatch(fetchCartItems());
  }, []);

  // const cartChange = (data) => {
  //   const idx = cartItems.findIndex((val) => {
  //     return val.id === data.id;
  //   });
  //   const temp = [...cartItems];
  //   if (idx < 0) {
  //     temp.push({ ...data, amount: 1 });
  //   } else {
  //     temp[idx] = { ...temp[idx], amount: temp[idx].quantity + 1 };
  //   }
  //   dispatch(setCarts(temp))
  // };

  return (
    <UserLayout>
      <div className="container mx-auto max-w-sm h-[100svh] font-roboto">
        <div className="flex tracking-tight justify-center mb-3 ">
          <h1 className="text-xl font-bold">Cart</h1>
        </div>
        <div className="">
          <div className="flex flex-col items-center mb-3">
            <hr className="h-px w-full sm:w-11/12 bg-black border-0 dark:bg-gray-700"></hr>
          </div>
          <CartProductLists arrays={cartItems} />
        </div>
        <CartContainer className="mt-3 p-3 flex-col rounded-md sticky top-[80vh]">
          <div className="flex flex-row justify-between">
            <p>
              Total: <span className="font-bold">Rp50000</span>
            </p>
            <Button color="blue">Checkout</Button>
          </div>
        </CartContainer>
      </div>
    </UserLayout>
  );
};
export default Cart;
