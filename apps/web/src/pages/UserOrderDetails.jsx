import { Button, Card, Modal } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { HiChevronLeft } from 'react-icons/hi2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_CALL from '../helpers/API';
import { UserCancelOrderModal } from '../components/UserCancelOrderModal';

const UserOrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [proofUpload, setProofUpload] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const getOrderDetails = async (orderId) => {
    const response = await API_CALL.get(`/transaction/details/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response) {
      setOrder(response.data.result);
    }
  };

  useEffect(() => {
    if (orderId && !openModal) {
      getOrderDetails(orderId);
    }
  }, [orderId, openModal]);

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
      console.log('🚀 ~ handleUploadProof ~ response:', response);
      setUploaded(true);
      getOrderDetails(orderId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pb-4">
      <div className="sticky top-0 w-full bg-white flex items-center p-5 shadow-md">
        <div className="md:hidden items-center cursor-pointer">
          <span
            className="w-8 h-8"
            onClick={() => {
              navigate(location.state?.previousPath || '/');
            }}
          >
            <HiChevronLeft size={30} />
          </span>
        </div>
        <p className="w-full m-0 text-lg font-bold text-center">
          Order Details
        </p>
      </div>
      <div className="container mx-auto max-w-[480px] h-[100vh] font-roboto overflow-y-auto p-2 ">
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
                    <div className="capitalize break-words w-40 sm:w-full">
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
        {!order?.img && order?.paymentMethod === 'transfer' && (
          <Card className="mt-2 shadow-md">
            <p className="font-semibold capitalize">upload bukti transfer</p>
            {proofUpload && (
              <img
                className="w-full h-full object-cover"
                src={URL.createObjectURL(proofUpload)}
              />
            )}
            {!proofUpload ? (
              <Button className="bg-blue-500" onClick={handleClick}>
                Select File...
              </Button>
            ) : (
              <div className="flex flex-col gap-y-4">
                <Button className="bg-blue-500" onClick={handleUploadProof}>
                  Upload Proof
                </Button>
                <Button className="bg-blue-500" onClick={handleClick}>
                  Select Another File...
                </Button>
              </div>
            )}
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              id="proofUpload"
              name="proofUpload"
              onChange={handleFile}
              accept=".jpg,.png,.jpeg,.gif"
            />
          </Card>
        )}
        {order?.paymentMethod === 'transfer' && order?.status === 'pending' && (
          <Card className="shadow-none border-none">
            <Button color="failure" onClick={() => setOpenModal(!openModal)}>
              <p className="capitalize text-base">cancel order</p>
            </Button>
          </Card>
        )}
      </div>
      <UserCancelOrderModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        order={order}
      />
    </div>
  );
};

export default UserOrderDetails;
