import { useEffect, useState } from 'react';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Button, Pagination } from 'flowbite-react';
import API_CALL from '../../helpers/API';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import customToast from '../../utils/toast';
import ManageStoreTable from '../../components/table/ManageStoreTable';
import LayoutDashboard from '../../components/LayoutDashboard';
import { customButton } from '../../helpers/flowbiteCustomTheme';

const ManageStore = () => {
  const [openModalMain, setOpenModalMain] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
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
    } catch (error) {}
    setIsLoading(false);
  };

  const handleDelete = async () => {
    try {
      setOpenModalDelete(false);
      setIsLoading(true);
      const result = await API_CALL.delete('/store/' + selectedBranch, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      customToast('success', 'Branch is deleted');
      getStoreData();
    } catch (error) {
      customToast('error', 'Failed to delete branch');
    }
    setIsLoading(false);
  };

  const handleSetMain = async () => {
    try {
      setOpenModalMain(false);
      setIsLoading(true);
      const result = await API_CALL.patch(
        '/store/' + selectedBranch + '/main',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      customToast('success', 'Main branch is changed');
      getStoreData();
    } catch (error) {
      customToast('error', 'Failed to change main branch');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getStoreData();
  }, [searchParams]);

  return (
    <>
      <LayoutDashboard>
        <LoadingSpinner isLoading={isLoading} size={16} />
        <LayoutPageAdmin title="Manage Store">
          <div className="flex flex-col md:flex-row justify-between gap-2 mb-3">
            <div>
            <Button 
              theme={customButton}
              size={'responsive'}
              color="secondary"
              onClick={() => {
                navigate('/manage/store/create');
              }}
            >
              + Add Branch
            </Button>
            </div>
            <div className="flex rounded-xl border-2 border-gray-500 focus-within:border-gray-700 p-1 overflow-hidden items-center gap-1">
              <span className="w-6 h-6">
                <HiMagnifyingGlass size={'100%'} />
              </span>
              <input
                type="search"
                defaultValue={searchParams.get('q')}
                placeholder="Search store name"
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
          <div className="grid grid-cols-1 overflow-x-auto gap-2">
            <ManageStoreTable
              storeData={storeData}
              onClickEdit={(value) => navigate('/manage/store/' + value)}
              onClickSetMain={(value) => {
                setSelectedBranch(value);
                setOpenModalMain(true);
              }}
              onClickDelete={(value) => {
                setSelectedBranch(value);
                setOpenModalDelete(true);
              }}
              openModalMain={openModalMain}
              openModalDelete={openModalDelete}
              onCloseModalMain={() => setOpenModalMain(false)}
              onCloseModalDelete={() => setOpenModalDelete(false)}
              onHandleDelete={handleDelete}
              onHandleSetMain={handleSetMain}
            />
            <div className="flex overflow-x-auto justify-end">
              <Pagination
                currentPage={Number(searchParams.get('page')) || 1}
                totalPages={totalPage}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </LayoutPageAdmin>
      </LayoutDashboard>
    </>
  );
};

export default ManageStore;
