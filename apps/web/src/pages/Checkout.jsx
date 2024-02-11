import React from 'react';
import UserLayout from '../components/UserLayout';
import { Button, Card } from 'flowbite-react';
import CartContainer from '../components/cart/CartContainer';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useDispatch, useSelector } from 'react-redux';
import customToast from '../utils/toast';
import SelectAddressCheckout from '../components/SelectAddressCheckout';
import SelectCourierCheckout from '../components/SelectCourierCheckout';
import { useSnap } from '../hooks/useMidtrans';
import SelectPayment from '../components/SelectPayment';
import { useNavigate } from 'react-router-dom';
import {
  handleSuccessCheckout,
  updateTransactionStatus,
} from '../helpers/checkout/updateTransaction';
import {
  deleteCheckedItemInCloud,
  setCheckoutItems,
} from '../redux/slice/cartSlice';
import { getCourierList } from '../helpers/checkout/checkoutFunctions';
const Checkout = () => {
  const [address, setAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [courier, setCourier] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  console.log('🚀 ~ Checkout ~ selectedCourier:', selectedCourier);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showCourier, setShowCourier] = useState(false);
  const [showSnap, setShowSnap] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showPayment, setShowPayment] = useState();
  const cartItems = useSelector((state) => state.cartReducer.checkoutItems);
  const currStore = useSelector((reducer) => reducer.storeReducer);
  console.log('🚀 ~ Checkout ~ currStore:', currStore.storeId);
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

  const checkoutItems = cartItems
    .filter((item) => item.checked === 1)
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
  console.log('🚀 ~ Checkout ~ checkedItems:', checkoutItems);
  const itemsInvId = checkoutItems.reduce((accu, item) => {
    accu.push(item.inventoryId);
    return accu;
  }, []);
  console.log('🚀 ~ itemsInvId ~ itemsInvId:', itemsInvId);
  const paymentTotal =
    checkoutItems.reduce((sum, item) => sum + item.value * item.quantity, 0) +
    selectedCourier?.price;

  const handlePay = async () => {
    if (!address || !courier) {
      customToast('error', 'harap lengkapi semua opsi');
      return;
    }
    const response = await API_CALL.post(
      '/transaction',
      {
        addressUUID: selectedAddress.UUID,
        storeUUID: currStore.storeId,
        shipmentTotal: selectedCourier.price,
        paymentTotal,
        checkoutItems,
        paymentMethod: selectedPayment.name,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
    if (response) {
      console.log('🚀 ~ handlePay ~ response:', response.data.result.invoice);
      setShowSnap(true);
      dispatch(deleteCheckedItemInCloud(itemsInvId, currStore.storeId));
      if (selectedPayment.name == 'transfer') {
        navigate(`/order-details?order_id=${response.data.result.invoice}`);
        return;
      }
      snapEmbed(response.data.result.token, 'snap-container', {
        onSuccess: (result) => {
          handleSuccessCheckout(response.data.result.invoice, 'paid');
          sessionStorage.removeItem('checkoutItems');
          setShowSnap(false);
        },
        onPending: (result) => {
          console.log(result);
          setShowSnap(false);
        },
        onClose: (result) => {
          console.log(result);
          setShowSnap(false);
        },
      });
    }
  };

  useEffect(() => {
    if (cartItems.length < 1) {
      dispatch(
        setCheckoutItems(JSON.parse(sessionStorage.getItem('checkoutItems'))),
      );
    }
  }, []);

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
    <UserLayout>
      <div className="w-full overflow-y-auto">
        <div className="container mx-auto max-w-[480px] h-[100vh] font-roboto  bg-gray-100 ">
          {!showSnap && (
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
                <SelectPayment
                  selectedPayment={selectedPayment}
                  showPayment={showPayment}
                  onShowPayment={() => setShowPayment((prev) => !prev)}
                  onSelectPayment={(value) => {
                    setShowPayment(false);
                    setSelectedPayment(value);
                  }}
                />
              </Card>
              <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
                <p className="font-semibold">ringkasan pembayaran</p>
                <p className="font-semibold">subtotal pembayaran</p>
              </Card>
            </div>
          )}
          <div
            id="snap-container"
            className="flex justify-center items-center sm:w-full"
          ></div>
        </div>
      </div>
      <CartContainer
        className={` ${
          showSnap ? `hidden` : 'flex'
        } mt-3 p-3 flex-col rounded-md sm:fixed w-full sm:w-64 sm:right-36 sm:top-36`}
      >
        <div className="flex flex-row sm:flex-col justify-between sm:gap-y-4">
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
