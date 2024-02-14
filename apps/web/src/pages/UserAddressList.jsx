import { Avatar, Button, Label, Modal, TextInput } from 'flowbite-react';
import UserLayout from '../components/UserLayout';
import { HiChevronLeft, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import UserAddressListCard from '../components/UserAddressListCard';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';
import CosmoTextLogo from '../components/CosmoTextLogo';

const UserAddressList = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [addressList, setAddressList] = useState(null);
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
      console.log(error);
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
      console.log(error);
      customToast('error', 'Failed to delete address');
    }
    setDeleteId(null);
    setOpenModal(false);
    setIsLoading(false);
  };

  const handleDefault = async (id) => {
    try {
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
      console.log(error);
    }
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
                  handleDefault(value.UUID);
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
          {/* <Button
            fullSized={true}
            color="blue"
            onClick={() => {
              navigate('/profile/address/create', {
                state: { previousPath: location.pathname },
              });
            }}
          >
            Add new address
          </Button> */}
          <Modal
            show={openModal}
            size="md"
            onClose={() => {
              setOpenModal(false);
              setDeleteId(null);
            }}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete the address?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    className="w-full"
                    isProcessing={isLoading}
                    color="failure"
                    onClick={() => {
                      handleDelete(deleteId);
                    }}
                  >
                    {"Yes, I'm sure"}
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserAddressList;
