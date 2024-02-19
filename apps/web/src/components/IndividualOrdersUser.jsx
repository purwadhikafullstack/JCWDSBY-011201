import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG_URL_PRODUCT } from '../constants/imageURL';
import { caseStatus } from '../constants/ordersStatusCase';
import { Button } from 'flowbite-react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
export function IndividualOrdersUser({
  idx,
  getOrderDetails,
  val,
  setOrderDetails,
  setOpenModalUser,
  openModalUser,
  setOpenModalDetail,
}) {
  const navigate = useNavigate();
  return (
    <div className="sm:w-full bg-white shadow p-4 rounded-md">
      <div className=" items-center flex justify-between text-xs md:text-base mb-3">
        <div className="flex flex-col lg:flex-row gap-2 items-start">
          <p>
            {new Date(val.createdAt).toLocaleString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="truncate">{val.invoice}</p>
          <p className="font-semibold capitalize">{val.paymentMethod}</p>
        </div>
        <div>
          <div
            className={`align-middle max-w-fit lg:pr-10 py-1 rounded-md overflow-hidden text-ellipsis whitespace-nowrap`}
          >
            {caseStatus(val.paymentStatus)}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between mb-6">
        <div className=" flex flex-col gap-y-2">
          <div key={idx} className="flex gap-4 w-[370px] ">
            <img
              src={`${IMG_URL_PRODUCT}${val.firstItem?.inventory?.product.product_images.image}`}
              alt={val.firstItem?.inventory?.product.name}
              className="rounded-sm h-[60px] w-[60px]"
            />
            <div className="pr-10 md:pr-0">
              <p className="text-ellipsis font-semibold">
                {val.firstItem?.inventory?.product.name}
              </p>
              {val.itemCount > 1 && (
                <p className="text-xs lg:text-base">+1 produk lainnya</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center border-l-[1px] pl-1 md:w-[200px] lg:pl-10 md:pl-5 mt-3 ">
          <p className="text-slate-600 text-sm md:text-md">Total Belanja</p>
          <p className="font-semibold">
            {' '}
            Rp {val.paymentTotal.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-x-3">
        {(val.paymentStatus === 'pending' &&
          val.paymentMethod === 'transfer') && (
          <Button
            color="blue"
            className="hover:cursor-pointer"
            onClick={() => {
              navigate(`/checkout-transfer?order_id=${val.invoice}`);
            }}
          >
           Upload Bukti Transfer
          </Button>
        )}
        {(val.paymentStatus === 'sending' ||
          val.paymentStatus === 'arrived') && (
          <Button
            color="success"
            className="hover:cursor-pointer"
            onClick={() => {
              getOrderDetails(val?.invoice, setOrderDetails);
              setOpenModalUser(!openModalUser);
            }}
          >
            Finish Order
          </Button>
        )}
        <Button
          color="blue"
          className="hover:cursor-pointer"
          onClick={() => {
            getOrderDetails(val?.invoice, setOrderDetails);
            setOpenModalDetail(true);
          }}
        >
          Details
          <HiOutlineArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
