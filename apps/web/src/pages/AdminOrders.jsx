import React, { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { Button, Pagination } from 'flowbite-react';
import SortBar from '../components/SortBar';
import { useSelector } from 'react-redux';
import { DatepickerForOrders } from '../components/DatepickerForOrders';
import LayoutDashboard from '../components/LayoutDashboard';
import LayoutPageAdmin from '../components/LayoutPageAdmin';
import { ModalForAdminOrderDetails } from '../components/ModalForAdminOrderDetails';
import { getStore } from '../helpers/queryData';
import { getOrderDetails } from '../helpers/orders/getOrdersByInvoice';
import { caseStatus } from '../constants/ordersStatusCase';
import { customTable } from '../helpers/flowbiteCustomTheme';
import { OrdersTable } from '../components/table/OrdersTable';
import { handleFilterStore } from '../helpers/orders/handleFilterStore';
const AdminOrders = () => {
  const [order, setOrder] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const currentUser = useSelector((state) => state.userReducer);
  const fetchOrders = async () => {
    const response = await API_CALL.get('/transaction/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      params: {
        order_id: searchParams.get('order_id'),
        status: searchParams.get('status'),
        sort: searchParams.get('sort'),
        payment: searchParams.get('payment'),
        from: searchParams.get('from'),
        to: searchParams.get('to'),
        page: searchParams.get('page'),
        store: searchParams.get('store'),
      },
    });
    if (response) {
      setOrder(response.data.result);
      setTotalPage(Math.ceil(response.data.count / 5));
    }
  };
  useEffect(() => {
    fetchOrders();
    if (currentUser?.role === 'super') {
      getStore(setStoreData, setIsLoading);
    }
  }, [searchParams, openModal]);
  const onPageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
  };

  return (
    <LayoutDashboard>
      <LayoutPageAdmin title="Orders">
        <div className="w-full font-roboto  bg-gray-50 p-3 ">
          <div className="search bg-white flex flex-grow items-center border-2 py-2 px-4 rounded-full gap-2 mb-4">
            <input
              type="search"
              placeholder="invoice code or payment method"
              className=" flex-grow outline-none bg-transparent text-sm font-semibold"
              defaultValue={searchParams.get('order_id')}
              onChange={(e) => {
                setTimeout(() => {
                  setSearchParams((value) => {
                    if (!e.target.value) {
                      value.delete('order_id');
                      value.delete('payment');
                      value.delete('page');
                    } else {
                      value.set('order_id', e.target.value);
                      value.set('payment', e.target.value);
                      value.set('page', 1);
                    }
                    return value;
                  });
                }, 1000);
              }}
            />
            <span className="w-6 h-6">
              <HiOutlineMagnifyingGlass size={'100%'} />
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-x-4">
            <label className="flex flex-col mb-4 font-bold gap-y-3">
              Payment Status
              <select
                id="payment"
                defaultValue={'default'}
                onChange={(e) => {
                  setSearchParams((value) => {
                    value.set('page', 1);
                    if (e.target.value === 'reset') {
                      value.delete('status');
                    } else {
                      value.set('status', e.target.value);
                    }
                    return value;
                  });
                }}
                className="bg-gray-50 border font-normal capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 lg:w-56 p-2.5 "
              >
                <option value={'default'} disabled>
                  Choose payment status
                </option>
                <option value={'rejected'}>rejected</option>
                <option value={'canceled'}>canceled</option>
                <option value={'pending'}>pending</option>
                <option value={'paid'}>paid</option>
                <option value={'checking'}>checking</option>
                <option value={'sending'}>sending</option>
                <option value={'arrived'}>arrived</option>
                <option value={'finished'}>finished</option>
              </select>
              <Button
                className="w-20 h-10"
                color="blue"
                onClick={() => {
                  setSearchParams((value) => {
                    value.delete('status');
                    return value;
                  });
                }}
              >
                Clear
              </Button>
            </label>
            <DatepickerForOrders setSearchParams={setSearchParams} />
            <SortBar
              title={'Store :'}
              onChange={(e) =>
                handleFilterStore(e.target.value, searchParams, setSearchParams)
              }
              hidden={currentUser.role !== 'super' ? true : false}
            >
              <option value={'all'}>All</option>
              {storeData &&
                storeData.map((val, index) => {
                  if (searchParams.get('store') === val.UUID) {
                    return (
                      <option key={index} value={val.UUID} selected>
                        {val.name}
                      </option>
                    );
                  }
                  return (
                    <option key={index} value={val.UUID}>
                      {val.name}
                    </option>
                  );
                })}
            </SortBar>
          </div>
          <div className="grid overflow-x-auto mb-6">
            {order ? (
              !order.length ? (
                <span>Data not available</span>
              ) : (
                <OrdersTable
                  customTable={customTable}
                  order={order}
                  caseStatus={caseStatus}
                  getOrderDetails={getOrderDetails}
                  setOrderDetails={setOrderDetails}
                  setOpenModal={setOpenModal}
                  openModal={openModal}
                />
              )
            ) : (
              <span>Data not available</span>
            )}
          </div>
          <div className="flex overflow-x-auto justify-end">
            <Pagination
              currentPage={Number(searchParams.get('page')) || 1}
              totalPages={totalPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>
        <ModalForAdminOrderDetails
          openModal={openModal}
          setOpenModal={setOpenModal}
          order={orderDetails}
        />
      </LayoutPageAdmin>
    </LayoutDashboard>
  );
};
export default AdminOrders;
