import React, { useState } from 'react';
import { Button, Modal, Card } from 'flowbite-react';
import { reduceTotalPrice } from '../helpers/orders/reduceTotalPrice';
import { IMG_URL_PROOF } from '../constants/imageURL';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useSearchParams } from 'react-router-dom';
import { UserCancelOrderModal } from './UserCancelOrderModal';
import { copyToClipboard } from '../helpers/orders/copyToClipboard';
import { FaRegCopy } from 'react-icons/fa';
import { useDayCountdown } from '../hooks/useDayCountDown';
import { DaysCountDown } from './DaysCountDown';
export function ModalForUserOrderDetails({
  openModalDetail,
  setOpenModalDetail,
  order,
}) {
  const totalPrice = reduceTotalPrice(order);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [days, hours, minutes, seconds] = useDayCountdown(order?.updatedAt, 3);

  return (
    <Modal
      show={openModalDetail}
      position="center"
      onClose={() => {
        setSearchParams((value) => {
          value.delete('order_id');
          return value;
        });
        setOpenModalDetail(false);
        return;
      }}
    >
      <Modal.Header className="capitalize">Detail Transaksi</Modal.Header>
      <Modal.Body>
        <div className="font-roboto overflow-y-auto md:px-3 ">
          {order?.updatedAt &&
            order?.status === 'arrived' &&
            days + hours + minutes + seconds >= 0 && (
              <div className="flex flex-col text-center gap-2">
                <p className="self-center capitalize font-semibold">
                  status akan berubah secara otomatis menjadi{' '}
                  <span className="text-emerald-500">Finished</span> dalam waktu
                  :
                </p>
                <DaysCountDown
                  days={days}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  displayText={true}
                />
              </div>
            )}
          <Card className="mt-2 shadow-md">
            <p className="font-bold text-lg capitalize">Information</p>
            <div className="flex justify-between ">
              <p>Invoice</p>
              <div
                className="flex items-center hover:cursor-pointer"
                onClick={() => {
                  copyToClipboard(order?.invoice ?? '');
                }}
              >
                <p className="hover:cursor-pointer">{order?.invoice}</p>
                <FaRegCopy />
              </div>
            </div>
            <div className="flex justify-between ">
              <p>Resi</p>
              <div
                className="flex items-center hover:cursor-pointer"
                onClick={() => {
                  copyToClipboard(order?.resi ?? '');
                }}
              >
                <p>{order?.resi || '-'}</p>
                <FaRegCopy />
              </div>
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
                className={`capitalize font-bold ${
                  order?.status === 'canceled' ||
                  order?.status === 'rejected' ||
                  order?.status === 'refunded'
                    ? 'text-red-500'
                    : ''
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
                      <div className="capitalize break-words w-28 sm:w-full">
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
          {order?.img && order?.paymentMethod === 'transfer' && (
            <Card className="mt-2 shadow-md">
              <p className="font-semibold capitalize">bukti transfer</p>
              {order?.status === 'rejected' ? (
                <p className="text-2xl text-red-500 font-bold self-center">
                  REJECTED
                </p>
              ) : (
                <div className="flex items-center justify-center">
                  <Zoom>
                    <img
                      className="w-80 h-80 object-scale-down"
                      alt={order?.img}
                      src={`${IMG_URL_PROOF}${order?.img}`}
                    />
                  </Zoom>
                </div>
              )}
            </Card>
          )}
        </div>
        {order?.paymentMethod === 'transfer' && order?.status === 'pending' && (
          <Card className="shadow-none border-none">
            <Button color="failure" onClick={() => setOpenModal(!openModal)}>
              <p className="capitalize text-base">cancel order</p>
            </Button>
          </Card>
        )}
        <UserCancelOrderModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          order={order}
          setOpenModalDetail={setOpenModalDetail}
        />
      </Modal.Body>
    </Modal>
  );
}
