import React from 'react';
import UserLayout from '../components/UserLayout';
import { Button } from 'flowbite-react';
import CartContainer from '../components/cart/CartContainer';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useDispatch, useSelector } from 'react-redux';
import customToast from '../utils/toast';
import { useSnap } from '../hooks/useMidtrans';
import { useNavigate } from 'react-router-dom';
import { setCheckoutItems } from '../redux/slice/cartSlice';
import { getCourierList } from '../helpers/checkout/checkoutFunctions';
import { handlePay } from '../helpers/checkout/handlePay';
import { CheckoutLeftSide } from '../components/CheckoutLeftSide';
const Checkout = () => {
  const [address, setAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [courier, setCourier] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showCourier, setShowCourier] = useState(false);
  const [showSnap, setShowSnap] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showPayment, setShowPayment] = useState();
  const [voucher, setVoucher] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const cartItems = useSelector((state) => state.cartReducer.checkoutItems);
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const { snapEmbed } = useSnap();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getAvailableAddress = async () => {
    try {
      const result = await API_CALL.get('/utils/shipping-address', {
        params: {
          storeId: currStore.storeId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setAddress(result.data.result);
      if (result.data.result.length > 0) {
        setSelectedAddress(result.data.result[0]);
      } else {
        customToast('error', 'Address in range not found');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (cartItems?.length < 1) {
      if (sessionStorage.getItem('checkoutItems')) {
        dispatch(
          setCheckoutItems(JSON.parse(sessionStorage.getItem('checkoutItems'))),
        );
      } else {
        navigate('/');
      }
    }
  }, []);

  const checkoutItems = cartItems
    ?.filter((item) => item.checked === 1)
    .map(
      ({
        productName,
        productPrice,
        productWeight,
        discountedPrice,
        amount,
        ...rest
      }) => ({
        name: productName,
        value: discountedPrice ?? productPrice,
        weight: productWeight,
        quantity: amount,
        ...rest,
      }),
    );
  const itemsInvId = checkoutItems?.reduce((accu, item) => {
    accu.push(item.inventoryId);
    return accu;
  }, []);
  const paymentTotal =
    checkoutItems?.reduce((sum, item) => sum + item.value * item.quantity, 0) +
    selectedCourier?.price;

  const itemTotal = checkoutItems?.reduce(
    (sum, item) => sum + item.value * item.quantity,
    0,
  );

  useEffect(() => {
    if (currStore.postalCode !== '') {
      getAvailableAddress();
    }
  }, [currStore.storeId]);

  useEffect(() => {
    if (selectedAddress && checkoutItems) {
      getCourierList(
        checkoutItems,
        currStore,
        selectedAddress,
        setCourier,
        setSelectedCourier,
      );
    }
  }, [selectedAddress]);

  return (
    <>
      <UserLayout>
        <div
          id="snap-container"
          className="flex justify-center items-center sm:w-full"
        ></div>
        <div className="w-full h-full flex flex-col overflow-auto lg:flex-row lg:gap-x-4 lg:px-32 lg:py-4">
          <CheckoutLeftSide
            showSnap={showSnap}
            selectedAddress={selectedAddress}
            address={address}
            showAddresses={showAddresses}
            setShowAddresses={setShowAddresses}
            setShowCourier={setShowCourier}
            setCourier={setCourier}
            setSelectedAddress={setSelectedAddress}
            selectedCourier={selectedCourier}
            courier={courier}
            showCourier={showCourier}
            setSelectedCourier={setSelectedCourier}
            selectedPayment={selectedPayment}
            showPayment={showPayment}
            setShowPayment={setShowPayment}
            setSelectedPayment={setSelectedPayment}
            setVoucher={setVoucher}
            voucher={voucher}
            itemTotal={itemTotal}
            setVoucherData={setVoucherData}
            cartItems={cartItems}
          />
          <div className="flex relative lg:h-64 lg:w-4/12 ">
            <CartContainer
              className={` ${
                showSnap ? `hidden` : 'flex'
              } mt-3 p-3 flex-col rounded-md lg:sticky w-full lg:w-96 lg:top-0`}
            >
              <div className="flex flex-row sm:flex-col justify-between sm:gap-y-4">
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
                        Rp{' '}
                        {(selectedCourier?.price || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col lg:flex-row justify-between font-bold">
                  <p className="">Total Belanja</p>
                  <p className="">
                    Rp {(paymentTotal || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handlePay(
                      selectedAddress,
                      selectedCourier,
                      selectedPayment,
                      currStore,
                      paymentTotal,
                      itemTotal,
                      checkoutItems,
                      voucherData,
                      itemsInvId,
                      snapEmbed,
                      setShowSnap,
                      navigate,
                    )
                  }
                  color="blue"
                >
                  Checkout
                </Button>
              </div>
            </CartContainer>
          </div>
        </div>
      </UserLayout>
    </>
  );
};

export default Checkout;
