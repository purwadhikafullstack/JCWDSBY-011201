import API_CALL from '../API';

export const getOrderDetails = async (orderId, setOrder) => {
  try {
    const response = await API_CALL.get(`/transaction/details/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response) {
      setOrder(response.data.result);
    }
  } catch (error) {
    console.log(error);
  }
};
