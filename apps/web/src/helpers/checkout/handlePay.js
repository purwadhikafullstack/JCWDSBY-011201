import { useNavigate } from 'react-router-dom';
import customToast from '../../utils/toast';
import { deleteCheckedItemInCloud } from '../../redux/slice/cartSlice';
import { handleSuccessCheckout } from './updateTransaction';
import API_CALL from '../API';

export const handlePay = async (
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
) => {
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
        navigate(`/checkout-transfer?order_id=${response.data.result.invoice}`);
        return;
      }
      snapEmbed(response.data.result.token, 'snap-container', {
        onSuccess: (result) => {
          handleSuccessCheckout(response.data.result.invoice, 'paid');
          sessionStorage.removeItem('checkoutItems');
          setShowSnap(false);
        },
        onPending: (result) => {
          sessionStorage.removeItem('checkoutItems');
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

export const handleVoucher = async (voucher, itemTotal, setVoucherData) => {
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
