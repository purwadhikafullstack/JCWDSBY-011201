import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';

const ActionAlertModal = ({
  openModal,
  onClose,
  message,
  color,
  isLoading,
  onActionModal,
}) => {
  return (
    <Modal show={openModal} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
            {message}
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              className="w-full"
              isProcessing={isLoading}
              color={color}
              onClick={onActionModal}
            >
              {"Yes, I'm sure"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ActionAlertModal;
