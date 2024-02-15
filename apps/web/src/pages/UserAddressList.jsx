import UserLayout from '../components/UserLayout';
import { HiChevronLeft } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import UserAddressListCard from '../components/UserAddressListCard';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';
import CosmoTextLogo from '../components/CosmoTextLogo';
import ActionAlertModal from '../components/modal/ActionAlertModal';

const UserAddressList = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalSetDefault, setOpenModalSetDefault] = useState(false);
  const [addressList, setAddressList] = useState(null);
  const [updateDefaultId, setUpdateDefaultId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const token = localStorage.getItem('authToken');

  const getAddressList = async () => {
    try {
      const result = await API_CALL.get('/address', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.success) {
        setAddressList(result.data.result);
      }
    } catch (error) {
      customToast('error', 'Failed to get address data');
    }
    setIsLoadingData(false);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const result = await API_CALL.delete('/address/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.success) {
        customToast('success', result.data.message);
        getAddressList();
      }
    } catch (error) {
      customToast('error', 'Failed to delete address');
    }
    setDeleteId(null);
    setOpenModal(false);
    setIsLoading(false);
  };

  const handleDefault = async (id) => {
    try {
      setIsLoading(true);
      const result = await API_CALL.patch(
        '/address/' + id + '/default',
        {
          isDefault: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (result.data.success) {
        customToast('success', 'Default address has been changed');
        getAddressList();
      }
    } catch (error) {
      customToast('error', 'Failed to change default address');
    }
    setUpdateDefaultId(null);
    setIsLoading(false);
    setOpenModalSetDefault(false);
  };

  useEffect(() => {
    getAddressList();
  }, []);

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
              navigate(location.state?.previousPath || '/profile');
            }}
          >
            <span className="w-8 h-8">
              <HiChevronLeft size={'100%'} />
            </span>
            <span className="font-bold text-3xl line-clamp-2 py-2">
              Manage Address
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center py-8 lg:px-32 px-4 gap-4 overflow-auto">
          {isLoadingData && (
            <div class="flex items-center w-full justify-between animate-pulse border rounded-xl p-4">
              <div>
                <div class="h-3 w-36 bg-gray-200 rounded-full mb-2.5"></div>
                <div class="w-56 h-3 bg-gray-200 rounded-full mb-2.5"></div>
                <div class="w-32 h-3 bg-gray-200 rounded-full "></div>
              </div>
              <div>
                <div class="h-3 bg-gray-300 rounded-full dark:bg-gray-700 w-12 mb-2.5"></div>
                <div class="h-5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
            </div>
          )}
          {addressList &&
            addressList.map((value) => (
              <UserAddressListCard
                key={value.UUID}
                address={value.address}
                district={value.district.districtName}
                city={value.city.cityName}
                province={value.province.provinceName}
                postal={value.postalCode}
                isDefault={value.isDefault}
                onDefault={() => {
                  setUpdateDefaultId(value.UUID);
                  setOpenModalSetDefault(true);
                }}
                onEdit={() => {
                  navigate(`/profile/address/${value.UUID}`, {
                    state: { previousPath: location.pathname },
                  });
                }}
                onDelete={() => {
                  setOpenModal(true);
                  setDeleteId(value.UUID);
                }}
              />
            ))}
          <ButtonWithLoading
            func={() => {
              navigate('/profile/address/create', {
                state: { previousPath: location.pathname },
              });
            }}
          >
            Add new address
          </ButtonWithLoading>
          <ActionAlertModal
            openModal={openModal}
            onClose={() => {
              setOpenModal(false);
              setDeleteId(null);
            }}
            message={'Are you sure you want to delete the address?'}
            color={'failure'}
            isLoading={isLoading}
            onActionModal={() => {
              handleDelete(deleteId);
            }}
          />
          <ActionAlertModal
            openModal={openModalSetDefault}
            onClose={() => {
              setOpenModalSetDefault(false);
              setUpdateDefaultId(null);
            }}
            message={'Are you sure you want to change default address?'}
            color={'blue'}
            isLoading={isLoading}
            onActionModal={() => {
              handleDefault(updateDefaultId);
            }}
          />
        </div>
      </div>
    </UserLayout>
  );
};

export default UserAddressList;
