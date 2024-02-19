import API_CALL from '../API';

export const getOrderDetails = async (orderId, setOrder,setOpenModal) => {
  try {
    const response = await API_CALL.get(`/transaction/details/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response) {
      setOrder(response.data.result);
    }
    if(setOpenModal){
      setOpenModal(true)
    }
  } catch (error) {
    console.log(error);
  }
};
