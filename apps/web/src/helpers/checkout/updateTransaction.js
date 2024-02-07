import customToast from '../../utils/toast';
import API_CALL from '../API';

export const updateTransactionStatus = async (invoice, status) => {
  try {
    const response = await API_CALL.patch(
      `/transaction/${invoice}`,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export const handleSuccessCheckout = async (invoice, status) => {
  try {
    const response = await API_CALL.patch(
      `/transaction/success/${invoice}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
    if (response) {
      customToast('success', response.data.message);
    }
  } catch (error) {
    console.log(error);
  }
};
