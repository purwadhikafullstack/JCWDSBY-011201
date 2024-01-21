import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useSelector } from 'react-redux';
import customToast from '../utils/toast';
import Container from '../components/Container';
import SelectAddressCheckout from '../components/SelectAddressCheckout';
import SelectCourierCheckout from '../components/SelectCourierCheckout';

const TesCheckOut = (props) => {
  const [address, setAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [courier, setCourier] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showCourier, setShowCourier] = useState(false);
  const currStore = useSelector((reducer) => reducer.storeReducer);
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

  const getCourierList = async () => {
    try {
      const result = await API_CALL.post(
        '/utils/courier-rates',
        {
          storePostal: currStore?.postalCode,
          userPostal: selectedAddress?.postalCode,
          items: [
            { name: 'shoes', value: 200000, weight: 160, quantity: 3 },
            { name: 'milk', value: 200000, weight: 160, quantity: 3 },
          ],
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

  useEffect(() => {
    if (currStore.postalCode !== '') {
      getAvailableAddress();
    }
  }, [currStore.storeId]);

  useEffect(() => {
    if (selectedAddress) {
      getCourierList();
    }
  }, [selectedAddress]);

  return (
    <Container>
      <div className="flex flex-col h-full w-full overflow-auto">
        <div className="flex flex-grow"></div>
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
      </div>
    </Container>
  );
};

export default TesCheckOut;
