import React from 'react';
import UserLayout from '../components/UserLayout';
import { Button, Card } from 'flowbite-react';
import CartContainer from '../components/cart/CartContainer';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useSelector } from 'react-redux';
import customToast from '../utils/toast';
import Container from '../components/Container';
import SelectAddressCheckout from '../components/SelectAddressCheckout';
import SelectCourierCheckout from '../components/SelectCourierCheckout';
const Checkout = () => {
  const [address, setAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [courier, setCourier] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showCourier, setShowCourier] = useState(false);
  const [showSendTime, setSendTime] = useState(false);
  const cartItems = useSelector((state) => state.cartReducer.items);
  const currStore = useSelector((reducer) => reducer.storeReducer);
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

  const checkedItems = cartItems
    .filter((item) => item.checked === 1)
    .map(({ productName, productPrice, productWeight, amount, ...rest }) => ({
      name: productName,
      value: productPrice,
      weight: productWeight,
      quantity: amount,
      ...rest,
    }));
  console.log('🚀 ~ Checkout ~ checkedItems:', checkedItems);

  const getCourierList = async (checkoutItems) => {
    try {
      const result = await API_CALL.post(
        '/utils/courier-rates',
        {
          storePostal: currStore?.postalCode,
          userPostal: selectedAddress?.postalCode,
          items: checkoutItems,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      console.log('🚀 ~ getCourierList ~ result:', result);
      localStorage.setItem('tempCourier', JSON.stringify(result.data.result));
      setCourier(result.data.result);
      if (result.data.result.length > 0) {
        setSelectedCourier(result.data.result[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currStore.postalCode !== '') {
      getAvailableAddress();
    }
  }, [currStore.storeId]);

  useEffect(() => {
    if (selectedAddress&&checkedItems) {
      getCourierList(checkedItems);
    }
  }, [selectedAddress]);

  return (
    <UserLayout>
      <div className="container mx-auto max-w-[480px] h-[100vh] font-roboto overflow-y-auto bg-gray-100 ">
        <div className="flex flex-col">
          <SelectAddressCheckout
            selectedAddress={selectedAddress}
            addressData={address}
            showAddresses={showAddresses}
            onShowAddresses={() => setShowAddresses((prev) => !prev)}
            onSelectAddress={(value) => {
              setShowCourier(false);
              setShowAddresses(false);
              if (selectedAddress.UUID !== value.UUID) {
                setCourier(null);
              }
              setSelectedAddress(value);
            }}
          />
          <SelectCourierCheckout
            selectedCourier={selectedCourier}
            courierData={courier}
            showCouriers={showCourier}
            onShowCouriers={() => setShowCourier((prev) => !prev)}
            onSelectCourier={(value) => {
              setShowCourier(false);
              setSelectedCourier(value);
            }}
          />
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
            <p className="font-semibold">subtotal pembayaran</p>
          </Card>
        </div>
      </div>
      <CartContainer className="mt-3 p-3 flex-col rounded-md  w-full sm:w-64  sm:right-36 sm:top-36">
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
    </UserLayout>
  );
};

export default Checkout;
