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
import { useSnap } from '../hooks/useMidtrans';
const Checkout = () => {
  const [address, setAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [courier, setCourier] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  console.log('🚀 ~ Checkout ~ selectedCourier:', selectedCourier);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showCourier, setShowCourier] = useState(false);
  const [showSendTime, setSendTime] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const cartItems = useSelector((state) => state.cartReducer.items);
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const { snapEmbed } = useSnap();
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

  
  const checkoutItems = cartItems
    .filter((item) => item.checked === 1)
    .map(({ productName, productPrice, productWeight, amount, ...rest }) => ({
      name: productName,
      value: productPrice,
      weight: productWeight,
      quantity: amount,
      ...rest,
    }));
  console.log('🚀 ~ Checkout ~ checkedItems:', checkoutItems);
  const paymentTotal = checkoutItems.reduce((sum, item) => sum + (item.value*item.quantity),0) + selectedCourier?.price
  console.log("🚀 ~ Checkout ~ paymentTotal:", paymentTotal)

  const handlePay = async () => {
    //   if (!address||!courier) {
    //     alert("harap lengkapi semua opsi")
    //     return
    //   }

    const response = await API_CALL.post(
      '/transaction',
      {
        addressUUID: selectedAddress.UUID,
        shipmentTotal: selectedCourier.price,
        paymentMethod,
        paymentTotal,
        checkoutItems
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
    snapEmbed('2af20b75-21a5-4b04-80d1-b88140a76ecc', 'snap-container');
  };

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
    if (selectedAddress && checkoutItems) {
      getCourierList(checkoutItems);
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
          <div
            id="snap-container"
            className="flex justify-center items-center sm:w-full"
          ></div>
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
          <Button onClick={handlePay} color="blue">
            Checkout
          </Button>
        </div>
      </CartContainer>
    </UserLayout>
  );
};

export default Checkout;
