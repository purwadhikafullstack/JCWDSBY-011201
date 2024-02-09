import { Button, Modal, Flowbite } from 'flowbite-react';
import { customButton } from '../../helpers/flowbiteCustomTheme';

const ModalConfirm = ({
    show,
    onClose,
    header,
    message,
    onConfirm,
    type,
    formRef
}) => {
    const customHeader = {
        modal: {
            header: {
                title: "text-xl w-full text-center font-medium text-gray-900 dark:text-white"
            }
        }
    };

    return <>
        <Flowbite theme={{theme: customHeader}}>
            <Modal show={show} onClose={onClose} position={'center'} size={'md'} dismissible popup>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Body>
                    <h3>{message}</h3>
                    <div className="flex justify-end mt-2 gap-4">
                        <Button theme={customButton} onClick={onClose} color='secondary'>Cancel</Button>
                        <Button theme={customButton} onClick={onConfirm} type={type || 'button'} form={formRef} color='primary' >Ok</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Flowbite>
    </>
}

export default ModalConfirm;