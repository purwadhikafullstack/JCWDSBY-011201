import React, { useState } from 'react';
import { Button, Modal, Card, FloatingLabel } from 'flowbite-react';
import { reduceTotalPrice } from '../helpers/orders/reduceTotalPrice';
import { IMG_URL_PROOF } from '../constants/imageURL';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
export function ModalForAdminOrderDetails({ openModal, setOpenModal, order }) {
  console.log("🚀 ~ ModalForAdminOrderDetails ~ order:", order)
  const [resi, setResi] = useState('');
  console.log('🚀 ~ ModalForAdminOrderDetails ~ resi:', resi);
  const totalPrice = reduceTotalPrice(order);
  const updateStatusForTransferAdmin = async (status, invoice) => {
    try {
      const response = await API_CALL.patch(
        '/transaction/proof/update',
        { status, invoice },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      customToast('success', response.data.message);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const sendingOrderForAdmin = async (status, invoice, resi) => {
    try {
      const response = await API_CALL.patch(
        '/transaction/admin/sending',
        { status, invoice, resi },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      console.log('🚀 ~ sendingOrderForAdmin ~ response:', response);
      customToast('success', response.data.message);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
  };
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
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      show={openModal}
      position="center"
      onClose={() => setOpenModal(false)}
    >
      <Modal.Header className="capitalize">Order Details</Modal.Header>
      <Modal.Body>
        <div className="font-roboto overflow-y-auto px-2 ">
          <Card className="mt-2 shadow-md">
            <p className="font-bold text-lg capitalize">Information</p>
            <div className="flex justify-between">
              <p>Invoice</p>
              <p>{order?.invoice}</p>
            </div>
            <div className="flex justify-between">
              <p>Resi</p>
              <p>{order?.resi}</p>
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
                <img
                  className="w-80 h-80 self-center object-scale-down"
                  alt={order?.img}
                  src={`${IMG_URL_PROOF}${order?.img}`}
                />
              )}
              {order?.status === 'checking' && (
                <div className="flex flex-col justify-center w-full gap-y-4">
                  <Button
                    color="success"
                    onClick={() => {
                      updateStatusForTransferAdmin('paid', order?.invoice);
                    }}
                  >
                    ACCEPT Payment Proof
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => {
                      updateStatusForTransferAdmin('rejected', order?.invoice);
                    }}
                  >
                    REJECT Payment Proof
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
        {order?.status === 'paid' && (
          <Card className="flex flex-col justify-center w-full mt-5 gap-y-4">
            <div>
              <label
                htmlFor="resi"
                className="block font-semibold text-gray-900 text-base mb-1"
              >
                Resi
              </label>
              <input
                type="text"
                id="resi"
                name="resi"
                onChange={(e) => setResi(e.target.value)}
                placeholder="Masukkan Nomer Resi"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <Button
              color="blue"
              onClick={() => {
                sendingOrderForAdmin('sending', order?.invoice, resi);
              }}
            >
              SEND ORDER
            </Button>
          </Card>
        )}
        {order?.status !== 'sending' &&
          order?.status !== 'finished' &&
          order?.status !== 'refunded' &&
          order?.status !== 'rejected' && (
            <Card className="flex flex-col justify-center w-full mt-5">
              <Button
                color="failure"
                onClick={() => {
                  cancelOrdersForAdmin('refunded', order?.invoice);
                }}
              >
                CANCEL ORDER
              </Button>
            </Card>
          )}
      </Modal.Body>
    </Modal>
  );
}
