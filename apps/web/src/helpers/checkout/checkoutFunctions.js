import customToast from "../../utils/toast";
import API_CALL from "../API";

export const getCourierList = async (
    checkoutItems,
    currStore,
    selectedAddress,
    setCourier,
    setSelectedCourier,
  ) => {
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
      localStorage.setItem('tempCourier', JSON.stringify(result.data.result));
      setCourier(result.data.result);
      if (result.data.result.length > 0) {
        setSelectedCourier(result.data.result[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

 export const getAvailableAddress = async (currStore,setAddress,setSelectedAddress) => {
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