import React, { useEffect } from 'react';
import { CartProductLists } from '../components/CartProductLists';
import UserLayout from '../components/UserLayout';
import CartContainer from '../components/cart/CartContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import {
  fetchCartItems,
  setCarts,
  setCheckoutItems,
} from '../redux/slice/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cartReducer.items);
  const freeItems = useSelector((state) => state.cartReducer.freeItems);
  console.log('🚀 ~ Cart ~ freeItems:', freeItems);
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  useEffect(() => {
    dispatch(fetchCartItems(storeUUID));
  }, [storeUUID]);

  const totalPrice = cartItems.reduce((accumulator, items) => {
    if (items.checked === 1) {
      const itemTotalPrice = items.finalPrice;
      return accumulator + itemTotalPrice;
    }
    return accumulator;
  }, 0);
  const checkedItemsInvId = cartItems.reduce((accu, item) => {
    if (item.checked === 1) {
      accu.push(item.inventoryId);
    }
    return accu;
  }, []);
  console.log('🚀 ~ checkedItemsInvId ~ checkedItemsInvId:', checkedItemsInvId);

  return (
    <UserLayout>
      <div className="flex flex-col lg:flex-row font-roboto h-full lg:px-32 lg:py-4 lg:gap-x-5 overflow-x-auto ">
        <div className="w-full lg:w-8/12 h-full overflow-y-auto ">
          <div className="flex tracking-tight mb-3 justify-center md:justify-start ">
            <h1 className="text-4xl font-bold">Cart</h1>
          </div>
          <div className="flex flex-col">
            <CartProductLists arrays={cartItems} />
          </div>
        </div>
        <div className="flex relative lg:h-64 lg:w-4/12 lg:py-10">
          <CartContainer className="mt-3 p-3 flex-col rounded-md lg:sticky w-full max-h-20 ">
            <div className="flex flex-row justify-between">
              <p>
                Total:{' '}
                <span className="font-bold">
                  Rp{totalPrice.toLocaleString('id-ID')}
                </span>
              </p>
              <Button
                color="blue"
                disabled={checkedItemsInvId?.length < 1 ? true : false}
                onClick={() => {
                  dispatch(setCheckoutItems([...cartItems, ...freeItems]));
                  window.sessionStorage.setItem(
                    'checkoutItems',
                    JSON.stringify([...cartItems, ...freeItems]),
                  );
                  navigate('/checkout');
                }}
              >
                Checkout
              </Button>
            </div>
          </CartContainer>
        </div>
      </div>
    </UserLayout>
  );
};
export default Cart;
