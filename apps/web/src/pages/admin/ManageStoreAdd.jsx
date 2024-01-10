import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Button,
  Label,
  Pagination,
  Select,
  Table,
  TextInput,
} from 'flowbite-react';
import API_CALL from '../../helpers/API';
import { HiChevronLeft } from 'react-icons/hi2';
import customToast from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import FormStore from '../../components/form/formStore';
import TopBar from '../../components/TopBar';

const ManageStoreAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminList, setAdminList] = useState(null);
  const [provinceList, setProvinceList] = useState(null);
  const [cityList, setCityList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [admin, setAdmin] = useState('');
  const [address, setAddress] = useState('');
  const [postal, setPostal] = useState('');
  const [branch, setBranch] = useState('');
  const navigate = useNavigate();

  const getAdminList = async () => {
    try {
      const result = await API_CALL.get('/admin');
      setAdminList(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProvinceList = async () => {
    try {
      const result = await API_CALL.get('/province');
      setProvinceList(result.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getCityList = async () => {
    try {
      const result = await API_CALL.get('/city', {
        params: {
          provinceId: province,
        },
      });
      setCityList(result.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getDistrictList = async () => {
    try {
      const result = await API_CALL.get('/district', {
        params: { cityId: city },
      });
      setDistrictList(result.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(admin);
  const onSubmitData = async () => {
    try {
      setIsLoading(true);
      if (
        !province ||
        !city ||
        !district ||
        !address ||
        !postal ||
        !admin ||
        !branch
      ) {
        throw { message: 'Please fill the required field' };
      }
      if (isNaN(postal) || postal.length < 5) {
        throw { message: 'Invalid postal code' };
      }
      const result = await API_CALL.post(
        '/store',
        {
          district: district,
          city: city,
          province: province,
          storeName: branch,
          address: address,
          postalCode: postal,
          user: admin,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      customToast('success', 'Success create new branch');
      navigate('/manage/store', { replace: true });
    } catch (error) {
      console.log(error);
      customToast('error', error.message || 'Failed to create new branch');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAdminList();
    getProvinceList();
  }, []);

  useEffect(() => {
    getCityList();
    getDistrictList();
  }, [province, city]);

  return (
    <>
      <div className="flex flex-row container bg-blue-100 min-w-[360px] h-max min-h-screen">
        <LoadingSpinner isLoading={isLoading} size={16} />

        <div className="flex flex-col w-full h-full gap-2">
          <TopBar
            title={'Create Branch'}
            prevPage={() => navigate('/manage/store')}
          />
          <FormStore
            province={province}
            city={city}
            district={district}
            branch={branch}
            admin={admin}
            address={address}
            postal={postal}
            provinceData={provinceList}
            cityData={cityList}
            districtData={districtList}
            adminData={adminList}
            onProvince={(e) => {
              setProvince(e.target.value);
              setCity(null);
              setDistrict(null);
            }}
            onCity={(e) => {
              setCity(e.target.value);
              setDistrict(null);
            }}
            onDistrict={(e) => {
              setDistrict(e.target.value);
            }}
            onAdmin={(e) => setAdmin(e.target.value)}
            onBranch={(e) => {
              setBranch(e.target.value);
            }}
            onAddress={(e) => setAddress(e.target.value)}
            onPostal={(e) => setPostal(e.target.value)}
            onSubmit={onSubmitData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ManageStoreAdd;
