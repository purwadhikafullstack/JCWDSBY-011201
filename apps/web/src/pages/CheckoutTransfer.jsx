import { Card } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { HiChevronLeft } from 'react-icons/hi2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_CALL from '../helpers/API';
import { UserCancelOrderModal } from '../components/UserCancelOrderModal';
import CosmoTextLogo from '../components/CosmoTextLogo';
import cosmoLogo from '../assets/cosmo-logo.svg';
import { IMG_URL_PROOF } from '../constants/imageURL';
import { useCountdown } from '../hooks/useCountdown';
import { updateTransactionStatus } from '../helpers/checkout/updateTransaction';
import { CheckoutTransferRightSide } from '../components/checkout/CheckoutTransferRightSide';

const CheckoutTransfer = () => {
  const [order, setOrder] = useState(null);
  const [proofUpload, setProofUpload] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [days, hours, minutes, seconds] = useCountdown(order?.createdAt);
  const getOrderDetails = async (orderId) => {
    const response = await API_CALL.get(`/transaction/details/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response) {
      setOrder(response.data.result);
    }
  };
  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId, openModal]);
  useEffect(() => {
    if (order?.status === 'pending' && days + hours + minutes + seconds <= 0) {
      updateTransactionStatus(order?.invoice, 'canceled');
      setTimeout(() => {
        getOrderDetails(orderId);
        console.log('yaaay');
      }, 1000);
    }
  }, [days, hours, minutes, seconds]);
  const handleFile = (e) => {
    setProofUpload(e.target.files[0]);
  };
  const handleClick = () => {
    inputRef.current.click();
  };
  const totalPrice = order?.items.reduce(
    (total, items) => total + items.price * items.amount,
    0,
  );
  const handleUploadProof = async () => {
    try {
      const formData = new FormData();
      formData.append('proofUpload', proofUpload);
      formData.append('invoice', orderId);
      const response = await API_CALL.patch('/transaction/proof', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setUploaded(true);
      getOrderDetails(orderId);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="pb-4">
      <div className="sticky top-0 w-full h-16 bg-white flex items-center p-5 shadow-md">
        <div className="md:hidden items-center cursor-pointer">
          <span
            className="w-8 h-8"
            onClick={() => {
              navigate('/orders');
            }}
          >
            <HiChevronLeft size={30} />
          </span>
        </div>
        <div
          className=" gap-2 cursor-pointer hidden md:flex"
          onClick={() => {
            navigate('/orders');
          }}
        >
          <img src={cosmoLogo} className="w-10 h-10" alt="" />
          <CosmoTextLogo size={'text-4xl'} />
        </div>
        <p className=" m-0 text-lg font-bold text-center md:ml-[360px]">
          Checkout Information
        </p>
      </div>
      <div className="flex flex-col  md:flex-row font-roboto p-2 md:gap-x-5 md:px-32">
        <div className="flex flex-col md:w-8/12 overflow-y-auto">
          {order?.paymentStatus === 'paid' && (
            <div className="items-center flex font-bold text-2xl w-full justify-center">
              <p>Checkout Berhasil</p>
            </div>
          )}
          <Card className="mt-2 shadow-md">
            <p className="font-bold text-lg capitalize">Information</p>
            <div className="flex justify-between">
              <p>Invoice</p>
              <p>{order?.invoice}</p>
            </div>
            <div className="flex justify-between">
              <p>Tipe Pembayaran</p>
              <p className={`capitalize`}>
                {order?.paymentMethod === 'transfer'
                  ? 'manual transfer'
                  : order?.paymentMethod}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Status</p>
              <p
                className={`capitalize ${
                  order?.status === 'canceled' ? 'text-red-500' : ''
                }`}
              >
                {order?.status}
              </p>
            </div>
          </Card>
          <Card className="mt-2 shadow-md">
            <p className="font-bold text-lg capitalize">rincian pesanan</p>
            <div className="flex flex-col">
              {order?.items.map((val, idx) => {
                return (
                  <div key={idx} className="flex justify-between mb-2 ">
                    <div className="flex gap-x-3">
                      <div>{val.amount ?? 1}x</div>
                      <div className="capitalize break-words w-40 md:w-full">
                        {val.name}
                      </div>
                    </div>
                    <div>Rp {val.price.toLocaleString('id-ID')}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-base">Total</p>
              <p>Rp {totalPrice?.toLocaleString('id-ID')}</p>
            </div>
          </Card>
        </div>
        <CheckoutTransferRightSide
          order={order}
          IMG_URL_PROOF={IMG_URL_PROOF}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          proofUpload={proofUpload}
          handleClick={handleClick}
          handleUploadProof={handleUploadProof}
          inputRef={inputRef}
          handleFile={handleFile}
          setOpenModal={setOpenModal}
          openModal={openModal}
        />
      </div>
      <UserCancelOrderModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        order={order}
        setOpenModalDetail={setOpenModalDetail}
      />
    </div>
  );
};

export default CheckoutTransfer;
