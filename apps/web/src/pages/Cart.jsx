import React, { useEffect } from 'react';
import { CartProductLists } from '../components/CartProductLists';
import UserLayout from '../components/UserLayout';
import CartContainer from '../components/cart/CartContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import { fetchCartItems, setCarts } from '../redux/slice/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cartReducer.items);
  const storeUUID = useSelector((state) => state.storeReducer.storeId);
  useEffect(() => {
    dispatch(fetchCartItems(storeUUID));
  }, [storeUUID]);

  const totalPrice = cartItems.reduce((accumulator, items) => {
    if (items.checked === 1) {
      const itemTotalPrice = items.productPrice * items.amount;
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
  console.log("🚀 ~ checkedItemsInvId ~ checkedItemsInvId:", checkedItemsInvId)

  return (
    <UserLayout>
      <div className="container mx-auto max-w-sm h-screen  font-roboto overflow-y-auto">
        <div className="flex tracking-tight justify-center mb-3 ">
          <h1 className="text-xl font-bold">Cart</h1>
        </div>
        <div className="flex flex-col">
          <CartProductLists arrays={cartItems} />
        </div>
      </div>
      <CartContainer className="mt-3 p-3 flex-col rounded-md sm:fixed w-full sm:w-64  sm:right-36 sm:top-36">
        <div className="flex flex-row justify-between">
          <p>
            Total:{' '}
            <span className="font-bold">
              Rp{totalPrice.toLocaleString('id-ID')}
            </span>
          </p>
          <Button
            color="blue"
            disabled={checkedItemsInvId?.length<1?true:false}
            onClick={() => {
              navigate('/checkout');
            }}
          >
            Checkout
          </Button>
        </div>
      </CartContainer>
    </UserLayout>
  );
};
export default Cart;
