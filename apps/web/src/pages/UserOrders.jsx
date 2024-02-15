import React, { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import UserLayout from '../components/UserLayout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { Pagination } from 'flowbite-react';
import { DatepickerForOrders } from '../components/DatepickerForOrders';
import { UserFinishOrderModal } from '../components/UserFinishOrderModal';
import { getOrderDetails } from '../helpers/orders/getOrdersByInvoice';
import { IndividualOrdersUser } from '../components/IndividualOrdersUser';
import { ModalForUserOrderDetails } from '../components/ModalForUserOrderDetails';
const UserOrders = () => {
  const [order, setOrder] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  console.log("🚀 ~ UserOrders ~ openModalDetail:", openModalDetail)
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
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
      },
    });
    if (response) {
      setOrder(response.data.result);
      setTotalPage(Math.ceil(response.data.count / 5));
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [searchParams,openModalDetail,openModalUser]);

  const onPageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
  };

  return (
    <UserLayout>
      <div className="w-full lg:px-32 ">
        <div className="container mx-auto max-w-[1024px] h-screen md:h-full  font-roboto  bg-gray-50 p-4 overflow-auto ">
          <div className="search bg-white flex items-center border-2 py-2 px-4 rounded-full gap-2 mb-4">
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
                    } else {
                      value.set('order_id', e.target.value);
                      value.set('payment', e.target.value);
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
          <label className="flex flex-col mb-4 font-bold">
            Payment Status
            <select
              id="payment"
              defaultValue={'default'}
              onChange={(e) => {
                setSearchParams((value) => {
                  value.delete('page');
                  if (e.target.value === 'reset') {
                    value.delete('status');
                  } else {
                    value.set('status', e.target.value);
                  }
                  return value;
                });
              }}
              className="bg-gray-50 border font-normal capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-56 p-2.5 "
            >
              <option value={'default'} disabled>
                Choose payment status
              </option>
              <option value={'reset'}>clear</option>
              <option value={'rejected'}>rejected</option>
              <option value={'canceled'}>canceled</option>
              <option value={'pending'}>pending</option>
              <option value={'paid'}>paid</option>
              <option value={'checking'}>checking</option>
              <option value={'arrived'}>arrived</option>
              <option value={'finished'}>finished</option>
            </select>
          </label>
          <DatepickerForOrders setSearchParams={setSearchParams} />
          <div className="flex flex-col flex-grow gap-y-4 overflow-y-auto">
            {order?.map((val, idx) => {
              return (
                <IndividualOrdersUser
                  key={idx}
                  getOrderDetails={getOrderDetails}
                  val={val}
                  setOrderDetails={setOrderDetails}
                  setOpenModalUser={setOpenModalUser}
                  setOpenModalDetail={setOpenModalDetail}
                  openModalUser={openModalUser}
                />
              );
            })}
          </div>
          <div className="flex overflow-x-auto justify-end">
            <Pagination
              currentPage={Number(searchParams.get('page')) || 1}
              totalPages={totalPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
      <UserFinishOrderModal
        openModalUser={openModalUser}
        setOpenModalUser={setOpenModalUser}
        order={orderDetails}
      />
      <ModalForUserOrderDetails
        openModalDetail={openModalDetail}
        setOpenModalDetail={setOpenModalDetail}
        order={orderDetails}
      />
    </UserLayout>
  );
};

export default UserOrders;
