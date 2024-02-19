import { Button, Modal } from 'flowbite-react';
import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { updateTransactionStatus } from '../helpers/checkout/updateTransaction';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
export function UserFinishOrderModal({ openModalUser, setOpenModalUser, order }) {
  console.log(order);
  const finishOrder = async (invoice, status) => {
    try {
      const response = await API_CALL.patch(
        '/transaction/orders/finish',
        {
          invoice,
          status,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      
      customToast('success', response.data.message);
      setOpenModalUser(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal show={openModalUser} size="md" onClose={() => setOpenModalUser(false)} popup>
      <Modal.Header>Selesaikan Pesanan Ini?</Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-blue-400 " />
          <h2 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to finish this order?
          </h2>
          <h3 className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400">
            Pastikan barang pesanan yang kamu terima sudah benar.
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="success"
              onClick={() => {
                finishOrder(order?.invoice, 'finished');
                
              }}
            >
              {"Yes, I'm sure"}
            </Button>
            <Button color="gray" onClick={() => setOpenModalUser(false)}>
              No, go back!
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
