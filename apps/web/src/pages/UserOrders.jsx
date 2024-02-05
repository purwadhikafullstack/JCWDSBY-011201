import React, { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import UserLayout from '../components/UserLayout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { Button, Datepicker, Pagination } from 'flowbite-react';
import { DatepickerForOrders } from '../components/DatepickerForOrders';
const UserOrders = () => {
  const [order, setOrder] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
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
    console.log('🚀 ~ fetchOrders ~ response:', response);
    if (response) {
      setOrder(response.data.result);
      setTotalPage(Math.ceil(response.data.count / 5));
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [searchParams]);

  const onPageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      /* you can also use 'auto' behaviour 
         in place of 'smooth' */
    });
  };

  const caseStatus = (status) => {
    switch (status) {
      case 'pending':
        return (
          <div className="font-semibold text-xl capitalize text-amber-500 ">
            pending
          </div>
        );
      case 'paid':
        return (
          <div className="font-semibold text-xl capitalize text-green-500 ">
            Paid
          </div>
        );
      case 'rejected':
        return (
          <div className="font-semibold text-xl capitalize text-red-500 ">
            rejected
          </div>
        );
      case 'checking':
        return (
          <div className="font-semibold text-xl capitalize text-amber-500 ">
            checking
          </div>
        );
      case 'refunded':
        return (
          <div className="font-semibold text-xl capitalize text-red-500 ">
            refunded
          </div>
        );

      default:
        break;
    }
  };

  return (
    <UserLayout>
      <div className="w-full">
        <div className="container mx-auto max-w-[640px] font-roboto  bg-gray-50 p-3 ">
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
              <option value={'pending'}>pending</option>
              <option value={'paid'}>paid</option>
              <option value={'checking'}>checking</option>
            </select>
          </label>
          <DatepickerForOrders setSearchParams={setSearchParams} />
          <div className="flex flex-col flex-grow gap-y-4 overflow-y-auto">
            {order?.map((val, idx) => {
              return (
                <div
                  key={idx}
                  className="block p-3 bg-white  rounded-lg shadow-lg w-full"
                >
                  <div className="flex mb-2  text-gray-900">
                    <div className="flex flex-col bg-white border border-gray-200 shadow w-1/3 p-1">
                      <div className="font-semibold text-blue-500 text-sm ">
                        INVOICE NO:
                      </div>
                      <div className="font-semibold text-sm  sm:text-lg ">
                        {val.invoice}
                      </div>
                      <div className="text-xs text-gray-400 ">
                        {new Date(val.createdAt).toLocaleString('en-GB', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 shadow w-1/3 p-1">
                      <div className="font-semibold text-blue-500 text-sm">
                        TOTAL:
                      </div>
                      <div className="font-semibold text-lg ">
                        Rp {val.paymentTotal.toLocaleString('id-ID')}
                      </div>
                      <div className="font-semibold text-blue-500 text-sm">
                        Via:
                      </div>
                      <div className="font-semibold text-lg capitalize ">
                        {val.paymentMethod}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 shadow w-1/3 p-1">
                      <div className="font-semibold text-blue-500 text-sm">
                        PAYMENT STATUS:
                      </div>
                      {caseStatus(val.paymentStatus)}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      color="blue"
                      className="hover:cursor-pointer"
                      onClick={() => {
                        navigate(`/order-details?order_id=${val.invoice}`);
                      }}
                    >
                      Details
                      <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
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
    </UserLayout>
  );
};

export default UserOrders;
