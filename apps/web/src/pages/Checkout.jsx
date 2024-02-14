import React from 'react';
import UserLayout from '../components/UserLayout';
import { Button, Card, Label, TextInput } from 'flowbite-react';
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleVoucher = async (voucher, itemTotal, setVoucherData) => {
    try {
      const response = await API_CALL.post(
        '/transaction/voucher',
        {
          voucher,
          itemTotal,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      setVoucherData(response.data.result);
      customToast('success', response.data.message);
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
      setVoucherData(null);
    }
  };

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
          <div className="w-full lg:w-8/12 h-[100vh] overflow-y-auto lg:h-full font-roboto flex flex-col bg-gray-100 ">
            {!showSnap && (
              <div className="flex flex-col">
                <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
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
                </Card>
                <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
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
                  <div className="mb-2 block">
                    <Label
                      htmlFor="voucher"
                      className="font-semibold"
                      value="Kode Voucher"
                    />
                  </div>
                  <TextInput
                    id="voucher"
                    type="text"
                    placeholder="XXXXXX......"
                    required
                    onChange={(e) => setVoucher(e.target.value)}
                  />
                  <Button
                    color="blue"
                    className="mt-3"
                    onClick={() =>
                      handleVoucher(voucher, itemTotal, setVoucherData)
                    }
                  >
                    Apply
                  </Button>
                </Card>
                <Card className="flex lg:hidden flex-col rounded-none capitalize mb-3">
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
                </Card>
              </div>
            )}
          </div>
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
                <Button onClick={handlePay} color="blue">
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
