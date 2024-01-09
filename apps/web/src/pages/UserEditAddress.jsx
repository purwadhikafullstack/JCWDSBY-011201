import UserLayout from '../components/UserLayout';
import { HiChevronLeft, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import FormAddress from '../components/form/formAddress';

const UserEditAddress = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [provinceId, setProvinceId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [address, setAddress] = useState('');
  const [postal, setPostal] = useState('');

  const getAddressDetail = async () => {
    try {
      const result = await API_CALL.get('/address/' + params.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setProvinceId(result.data.result.provinceId);
      setCityId(result.data.result.cityId);
      setDistrictId(result.data.result.districtId);
      setAddress(result.data.result.address);
      setPostal(result.data.result.postalCode);
    } catch (error) {
      console.log(error);
      navigate('/profile/address', { replace: true });
      customToast('error', 'Invalid Address');
    }
  };

  const getProvince = async () => {
    try {
      const result = await API_CALL.get('/province', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setProvince(result.data.result);
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    }
  };

  const handleEditAddress = async () => {
    try {
      setIsLoading(true);
      if (!province || !city || !district || !address || !postal) {
        throw { message: 'Please fill the required field' };
      }
      if (isNaN(postal) || postal.length < 5) {
        throw { message: 'Invalid postal code' };
      }

      const result = await API_CALL.patch(
        '/address/' + params.id,
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
      customToast('success', 'Success edit address');
      navigate('/profile/address', { replace: true });
    } catch (error) {
      console.log(error);
      customToast('error', error?.message || 'Failed to edit address');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAddressDetail();
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
        <div className="header flex flex-col pt-8 px-4 pb-4 bg-blue-50 gap-2">
          <div className="flex">
            <span className="text-blue-800 font-extrabold text-3xl">Cosmo</span>
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
              Edit Address
            </span>
          </div>
        </div>
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
          onSubmit={handleEditAddress}
          isLoading={isLoading}
        />
      </div>
    </UserLayout>
  );
};

export default UserEditAddress;
