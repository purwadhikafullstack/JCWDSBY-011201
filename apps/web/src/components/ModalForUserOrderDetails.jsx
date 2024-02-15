import React, { useState } from 'react';
import { Button, Modal, Card, FloatingLabel } from 'flowbite-react';
import { reduceTotalPrice } from '../helpers/orders/reduceTotalPrice';
import { IMG_URL_PROOF } from '../constants/imageURL';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
export function ModalForUserOrderDetails({
  openModalDetail,
  setOpenModalDetail,
  order,
}) {
  console.log('🚀 ~ ModalForAdminOrderDetails ~ order:', order);
  const [resi, setResi] = useState('');
  const totalPrice = reduceTotalPrice(order);

  const cancelOrdersForAdmin = async (status, invoice) => {
    try {
      const response = await API_CALL.patch(
        '/transaction/admin/cancel',
        { status, invoice },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      customToast('success', response.data.message);
      setOpenModalDetail(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      show={openModalDetail}
      position="center"
      onClose={() => setOpenModalDetail(false)}
    >
      <Modal.Header className="capitalize">Detail Transaksi</Modal.Header>
      <Modal.Body>
        <div className="font-roboto overflow-y-auto md:px-3 ">
          <Card className="mt-2 shadow-md">
            <p className="font-bold text-lg capitalize">Information</p>
            <div className="flex justify-between">
              <p>Invoice</p>
              <p>{order?.invoice}</p>
            </div>
            {order?.resi && (
              <div className="flex justify-between">
                <p>Resi</p>
                <p>{order?.resi}</p>
              </div>
            )}
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
                  order?.status === 'canceled' || order?.status === 'rejected'
                    ? 'text-red-500 font-bold'
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
                <div className='flex items-center justify-center'>
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
      </Modal.Body>
    </Modal>
  );
}
