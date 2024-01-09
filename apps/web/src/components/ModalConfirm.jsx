import { Button, Modal, Flowbite } from 'flowbite-react';

const ModalConfirm = (props) => {
    const customHeader = {
        modal: {
            header: {
                title: "text-xl w-full text-center font-medium text-gray-900 dark:text-white"
            }
        }
    };

    return <>
        <Flowbite theme={{theme: customHeader}}>
            <Modal show={props.show} onClose={props.onClose} position={'center'} dismissible popup>
                <Modal.Header>{props.header}</Modal.Header>
                <Modal.Body>
                    <h3>{props.message}</h3>
                    <div className="flex justify-end mt-2 gap-4">
                        <Button onClick={props.onClose} color='failure'>Cancel</Button>
                        <Button onClick={props.onConfirm} type={props.type || 'button'} form={props.formRef} color='blue' >Ok</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Flowbite>
    </>
}

export default ModalConfirm;