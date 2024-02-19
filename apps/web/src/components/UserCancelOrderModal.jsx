import { Button, Modal } from 'flowbite-react';
import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { updateTransactionStatus } from '../helpers/checkout/updateTransaction';
import { useNavigate } from 'react-router-dom';
export function UserCancelOrderModal({ openModal, setOpenModal, order,setOpenModalDetail }) {
  const navigate = useNavigate()
  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-blue-400 " />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to cancel this order?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={() => {
                updateTransactionStatus(order?.invoice,'canceled')
                setOpenModal(false);
                setOpenModalDetail(false)
                navigate('/orders')
              }}
            >
              {"Yes, I'm sure"}
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              No, go back!
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
