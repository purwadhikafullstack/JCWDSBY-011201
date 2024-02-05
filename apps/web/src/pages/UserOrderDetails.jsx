import { Button, Card } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiOutlinePencilSquare } from 'react-icons/hi2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_CALL from '../helpers/API';
import { GrDocumentImage } from 'react-icons/gr';
const UserOrderDetails = () => {
  const [order, setOrder] = useState(null);
  console.log("🚀 ~ UserOrderDetails ~ order:", order)
  const [proofUpload, setProofUpload] = useState(null);
  console.log('🚀 ~ OrderDetails ~ proofUpload:', proofUpload);
  const [uploaded, setUploaded] = useState(false);
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
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId]);

  const handleFile = (e) => {
    setProofUpload(e.target.files[0]);
  };
  const handleClick = () => {
    inputRef.current.click();
  };

  const paymentMethodChanger = (method) => {
    switch (method) {
      case 'upload':
        return 'manual transfer'
        
      case 'gopay':
        return 'gopay';
      case 'gopay':
        return 'gopay';
    }
  };

  const totalPrice = order?.items.reduce(
    (total, items) => total + items.price * items.amount,
    0,
  );
  console.log('🚀 ~ OrderDetails ~ totalPrice:', totalPrice);

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
    <div>
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
          <div className="flex justify-between">
            <p>Invoice</p>
            <p>{order?.invoice}</p>
          </div>
          <div className="flex justify-between">
            <p>Status</p>
            <p>{order?.status}</p>
          </div>
        </Card>
        <Card className="mt-2 shadow-md">
          <div className="flex flex-col">
            {order?.items.map((val, idx) => {
              return (
                <div key={idx} className="flex justify-between mb-2">
                  <div className="flex gap-x-3">
                    <div>{val.amount ?? 1}x</div>
                    <div className="capitalize">{val.name}</div>
                  </div>
                  <div>{val.price}</div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p>50000</p>
          </div>
        </Card>
        {!order?.img && order?.paymentMethod === 'upload' && (
          <Card className="mt-2 shadow-md">
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
      </div>
    </div>
  );
};

export default UserOrderDetails;
