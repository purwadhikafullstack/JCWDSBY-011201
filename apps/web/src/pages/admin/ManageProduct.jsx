import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import LayoutDashboard from "../../components/LayoutDashboard";
import { Button } from "flowbite-react";
import { customButton } from "../../helpers/flowbiteCustomTheme";
import ManageProductTable from "../../components/table/ManageProductTable";
import ResponsivePagination from "../../components/ResponsivePagination";
import { onPageChange } from "../../helpers/pagination";
import SearchBar from "../../components/SearchBar";
import ModalConfirm from "../../components/modal/ModalConfirm";

const ManageProduct = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentUserRole = useSelector((reducer) => reducer.userReducer.role);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);
  const [productId, setProductId] = useState(null);
  const [isOpen, setIsOpen] = useState();
  const queryParam = {
    limit: 5,
    page: searchParams.get('page')
  }

  useEffect(() => {
    getProduct();
  }, [totalPage]);

  useEffect(() => {
    getProduct();
  }, [searchParams.get('page')]);

  const getProduct = async () => {
    setIsLoading(true);
    const res = await API_CALL.get('product', {
      params: queryParam
    });
    if (res) {
      setData(res.data.result.rows);
      setTotalPage(res.data.result.totalPage)
      setIsLoading(false);
    }
  };

  const handleDeleteButton = async (id) => {
    setIsLoading(true);
    setIsOpen(false);
    await API_CALL.delete(`product/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    setIsLoading(false);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  return <>
    <LayoutDashboard>
      <LoadingSpinner isLoading={isLoading} size={16} />
      <LayoutPageAdmin title='Manage Product'>
        <div className='my-5 flex flex-col gap-3 justify-between lg:items-center lg:flex-row'>
          {currentUserRole === 'super' && <Button theme={customButton} size={'responsive'} color='secondary' onClick={() => navigate('/manage/product/create')}> <IoMdAdd className='mr-1 w-4 h-4' /> Add Product</Button>}
          <SearchBar placeholder={'Search product name'} />
        </div>
        <ManageProductTable
          data={data && data}
          onEdit={(item) => navigate(`/manage/product/edit/${item}`)}
          onDelete={(item) => { setProductId(item); setIsOpen(true); }}
          page={(searchParams.get('page') || 1)}
        />
        <div className="mt-3 mb-10">
          <ResponsivePagination
            currentPage={Number(searchParams.get('page')) || 1}
            totalPages={totalPage}
            onPageChange={(page) => onPageChange(page, setSearchParams)}
          />
        </div>
        <ModalConfirm
          show={isOpen}
          header={'Delete Product'}
          message={'Are you sure you want to delete a product?'}
          onClose={() => setIsOpen(false)}
          onConfirm={() => productId && handleDeleteButton(productId)}
        />
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default ManageProduct;