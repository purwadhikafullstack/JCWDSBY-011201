import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Button, Modal, Pagination, Table } from 'flowbite-react';
import API_CALL from '../../helpers/API';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  HiMagnifyingGlass,
  HiOutlineExclamationCircle,
  HiOutlineTrash,
  HiPencilSquare,
} from 'react-icons/hi2';
import customToast from '../../utils/toast';

const ManageStore = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const onPageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
  };

  const getStoreData = async () => {
    try {
      const result = await API_CALL.get('/store', {
        params: { q: searchParams.get('q'), page: searchParams.get('page') },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setStoreData(result.data.result.data);
      setTotalPage(Math.ceil(result.data.result.row / 8));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await API_CALL.delete('/store/' + selectedBranch, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      customToast('success', 'Branch is deleted');
      getStoreData();
      setOpenModal(false);
    } catch (error) {
      customToast('error', 'Failed to delete branch');
      console.log(error);
    }
    setIsLoading(false);
  };

  const onHandleSetMain = async (id) => {
    try {
      setIsLoading(true);
      const result = await API_CALL.patch(
        '/store/' + id + '/main',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      customToast('success', 'Main branch is changed');
      getStoreData();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      customToast('error', 'Failed to change main branch');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getStoreData();
  }, [searchParams]);

  return (
    <>
      <div className="flex flex-row container bg-blue-100 min-w-[360px] h-max min-h-screen">
        <AdminSidebar />
        <LoadingSpinner isLoading={isLoading} size={16} />
        <LayoutPageAdmin title="Manage Store">
          <div className="grid grid-cols-1 overflow-x-auto gap-2">
            <div className="flex justify-between">
              <Button
                color="blue"
                size={'sm'}
                onClick={() => {
                  navigate('/manage/store/create');
                }}
              >
                Add Branch
              </Button>
              <div className="flex rounded-xl border-2 border-gray-500 focus-within:border-gray-700 p-2 overflow-hidden items-center gap-1">
                <span className="w-6 h-6">
                  <HiMagnifyingGlass size={'100%'} />
                </span>
                <input
                  type="search"
                  defaultValue={searchParams.get('q')}
                  onChange={(e) => {
                    setTimeout(() => {
                      setSearchParams((prev) => {
                        if (e.target.value) {
                          prev.set('q', e.target.value);
                        } else {
                          prev.delete('q');
                        }
                        return prev;
                      });
                    }, 1000);
                  }}
                  className=" outline-none bg-transparent"
                />
              </div>
            </div>
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Branch Name</Table.HeadCell>
                <Table.HeadCell>Branch Admin</Table.HeadCell>
                <Table.HeadCell>Address</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Action</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {storeData &&
                  storeData.map((value) => (
                    <Table.Row
                      key={value.UUID}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
                        {value.name}
                        <span
                          className={`${
                            !value.isMain && 'hidden'
                          } bg-blue-800 ml-2 rounded-full text-white px-1 py-0.5`}
                        >
                          Main Branch
                        </span>
                      </Table.Cell>
                      <Table.Cell>{value.user.name}</Table.Cell>
                      <Table.Cell className="line-clamp-2">
                        {value.address}, {value.district.districtName},{' '}
                        {value.city.cityName}, {value.province.provinceName}
                      </Table.Cell>
                      <Table.Cell>
                        <Button.Group>
                          <Button
                            color="success"
                            onClick={() =>
                              navigate('/manage/store/' + value.UUID)
                            }
                          >
                            <HiPencilSquare />
                          </Button>
                          <Button
                            disabled={value.isMain ? true : false}
                            color="info"
                            onClick={() => onHandleSetMain(value.UUID)}
                          >
                            {value.isMain ? 'Main' : 'Set Main'}
                          </Button>
                          <Button
                            color="failure"
                            onClick={() => {
                              setOpenModal(true);
                              setSelectedBranch(value.UUID);
                            }}
                          >
                            <HiOutlineTrash />
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>

            <div className="flex overflow-x-auto justify-end">
              <Pagination
                currentPage={Number(searchParams.get('page')) || 1}
                totalPages={totalPage}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </LayoutPageAdmin>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this branch?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageStore;
