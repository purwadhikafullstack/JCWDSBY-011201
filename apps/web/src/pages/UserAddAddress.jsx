import UserLayout from '../components/UserLayout';
import { HiChevronLeft } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import FormAddress from '../components/form/formAddress';
import CosmoTextLogo from '../components/CosmoTextLogo';

const UserAddAddress = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [provinceId, setProvinceId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [address, setAddress] = useState('');
  const [postal, setPostal] = useState('');

  const getProvince = async () => {
    try {
      const result = await API_CALL.get('/province', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setProvince(result.data.result);
    } catch (error) {
      customToast('error', 'Failed to get province data');
    }
  };

  const getCity = async () => {
    try {
      const result = await API_CALL.get('/city', {
        params: {
          provinceId: provinceId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setCity(result.data.result);
    } catch (error) {
      customToast('error', 'Failed to get city data');
    }
  };

  const getDistrict = async () => {
    try {
      const result = await API_CALL.get('/district', {
        params: {
          cityId: cityId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setDistrict(result.data.result);
    } catch (error) {
      customToast('error', 'Failed to get district data');
    }
  };

  const handleAddAddress = async () => {
    try {
      setIsLoading(true);
      if (!province || !city || !district || !address || !postal) {
        throw { message: 'Please fill the required field' };
      }
      if (isNaN(postal) || postal.length < 5) {
        throw { message: 'Invalid postal code' };
      }

      const result = await API_CALL.post(
        '/address',
        {
          district: districtId,
          city: cityId,
          province: provinceId,
          address: address,
          postalCode: postal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      customToast('success', 'Success add address');
      navigate('/profile/address', { replace: true });
    } catch (error) {
      customToast('error', error?.message || 'Failed to add address');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getProvince();
  }, []);

  useEffect(() => {
    provinceId && getCity();
  }, [provinceId]);

  useEffect(() => {
    cityId && getDistrict();
  }, [cityId]);

  return (
    <UserLayout>
      <div className="flex flex-col h-full w-full">
        <div className="header flex flex-col pt-8 px-4 lg:px-32 pb-4 bg-blue-50 gap-2">
          <div className="flex">
            <CosmoTextLogo size={'text-4xl'} />
          </div>
          <div
            className="flex items-center gap-2"
            onClick={() => {
              navigate(location.state?.previousPath || '/profile/address');
            }}
          >
            <span className="w-8 h-8">
              <HiChevronLeft size={'100%'} />
            </span>
            <span className="font-bold text-3xl line-clamp-2 py-2">
              Add Address
            </span>
          </div>
        </div>
        <div className="flex w-full px-4 lg:px-32">
          <FormAddress
            province={provinceId}
            provinceData={province}
            city={cityId}
            cityData={city}
            district={districtId}
            districtData={district}
            address={address}
            postal={postal}
            onProvince={(e) => {
              setProvinceId(e.target.value);
              setCityId(null);
              setCity(null);
              setDistrictId(null);
              setDistrict(null);
            }}
            onCity={(e) => {
              setCityId(e.target.value);
              setDistrictId(null);
              setDistrict(null);
            }}
            onDistrict={(e) => {
              setDistrictId(e.target.value);
            }}
            onAddress={(e) => setAddress(e.target.value)}
            onPostal={(e) => setPostal(e.target.value)}
            onSubmit={handleAddAddress}
            isLoading={isLoading}
          />
        </div>
      </div>
    </UserLayout>
  );
};

export default UserAddAddress;
