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