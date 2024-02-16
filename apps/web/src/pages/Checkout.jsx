import React, { useRef } from 'react';
import UserLayout from '../components/UserLayout';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useDispatch, useSelector } from 'react-redux';
import customToast from '../utils/toast';
import { useSnap } from '../hooks/useMidtrans';
import { useNavigate } from 'react-router-dom';
import {
  deleteCheckedItemInCloud,
  setCheckoutItems,
} from '../redux/slice/cartSlice';
import {
  getAvailableAddress,
  getCourierList,
} from '../helpers/checkout/checkoutFunctions';
import { CheckoutLeftSide } from '../components/CheckoutLeftSide';
import { handleSuccessCheckout } from '../helpers/checkout/updateTransaction';
import { checkoutItemsFilterer } from '../constants/checkoutItems';
import { CheckoutRightSide } from '../components/CheckoutRightSide';
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
  const storeRef = useRef();
  const { snapEmbed } = useSnap();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const checkoutItems = checkoutItemsFilterer(cartItems);
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
    if (
      currStore?.postalCode !== '' &&
      storeRef.current !== currStore?.storeId
    ) {
      getAvailableAddress(currStore, setAddress, setSelectedAddress);
      storeRef.current = currStore?.storeId;
    }
  }, [currStore?.storeId, storeRef.current]);
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
  }, [selectedAddress?.UUID]);

  const handlePay = async () => {
    try {
      if (!selectedAddress || !selectedCourier || !selectedPayment) {
        customToast('error', 'harap lengkapi semua opsi');
        return;
      }
      const response = await API_CALL.post(
        '/transaction',
        {
          addressUUID: selectedAddress.UUID,
          storeUUID: currStore.storeId,
          shipmentTotal: selectedCourier?.price,
          paymentTotal,
          itemTotal,
          shipmentName: selectedCourier?.courier_name,
          checkoutItems,
          paymentMethod: selectedPayment.name,
          discountVoucherId: voucherData?.id ?? null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      if (response) {
        setShowSnap(true);
        dispatch(deleteCheckedItemInCloud(itemsInvId, currStore.storeId));
        if (selectedPayment.name == 'transfer') {
          navigate(
            `/checkout-transfer?order_id=${response.data.result.invoice}`,
          );
          return;
        }
        snapEmbed(response.data.result.token, 'snap-container', {
          onSuccess: (result) => {
            handleSuccessCheckout(response.data.result.invoice, 'paid');
            sessionStorage.removeItem('checkoutItems');
          },
          onPending: (result) => {
            sessionStorage.removeItem('checkoutItems');
            console.log(result);
          },
          onClose: (result) => {
            console.log(result);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <UserLayout>
        <div
          id="snap-container"
          className="flex justify-center self-center md:w-[768px]"
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
            voucherData={voucherData}
          />
          <CheckoutRightSide
            showSnap={showSnap}
            cartItems={cartItems}
            selectedCourier={selectedCourier}
            handlePay={handlePay}
            itemTotal={itemTotal}
            paymentTotal={paymentTotal}
          />
        </div>
      </UserLayout>
    </>
  );
};

export default Checkout;
