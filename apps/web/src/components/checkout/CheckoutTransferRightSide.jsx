import { Button, Card } from 'flowbite-react';
import React from 'react';
import { CountDown } from './CountDown';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useNavigate } from 'react-router-dom';
export function CheckoutTransferRightSide({
  order,
  IMG_URL_PROOF,
  hours,
  minutes,
  seconds,
  proofUpload,
  handleClick,
  handleUploadProof,
  inputRef,
  handleFile,
  setOpenModal,
  openModal,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:w-4/12">
      {order?.img && order?.paymentMethod === 'transfer' && (
        <Card className="mt-2 shadow-md">
          <p className="font-semibold capitalize">bukti transfer</p>
          <Zoom>
            <img
              className="w-full h-64 object-contain"
              alt={order?.img}
              src={`${IMG_URL_PROOF}${order?.img}`}
            />
          </Zoom>
          <p className="capitalize text-green-500 font-bold self-center">
            bukti transfer telah diunggah
          </p>
        </Card>
      )}
      {!order?.img &&
        order?.paymentMethod === 'transfer' &&
        order?.status !== 'canceled' && (
          <Card className="mt-2 shadow-md">
            <p className="font-semibold capitalize">upload bukti transfer</p>
            <p className="font-semibold capitalize text-sm">Transfer ke:</p>
            <div className="flex justify-between text-sm">
              <p>Nama</p>
              <p>Cosmo</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>Nomor Rekening</p>
              <p>(BCA) 5220304321</p>
            </div>
            {hours + minutes + seconds >= 0 ? (
              <CountDown hours={hours} minutes={minutes} seconds={seconds} />
            ) : null}
            {proofUpload && (
              <Zoom>
                <img
                  className="w-full h-64 object-contain"
                  src={URL.createObjectURL(proofUpload)}
                />
              </Zoom>
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
            {order?.paymentMethod === 'transfer' &&
              order?.status === 'pending' && (
                <Button
                  color="failure"
                  onClick={() => setOpenModal(!openModal)}
                >
                  <p className="capitalize text-base">cancel order</p>
                </Button>
              )}
          </Card>
        )}
      {order?.status === 'canceled' && order?.status === 'rejected' && (
        <Card className="mt-2 shadow-md">
          <p className="text-red-500 font-extrabold self-center text-lg">
            Order Dibatalkan
          </p>
          <Button
            color="blue"
            className="font-bold"
            onClick={() => navigate('/orders')}
          >
            Kembali
          </Button>
        </Card>
      )}
    </div>
  );
}
