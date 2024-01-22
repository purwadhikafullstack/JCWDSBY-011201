import { Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Button } from "flowbite-react";
import { useSelector } from 'react-redux'

const ModalEditInventory = ({
    isOpen,
    onClose,
    onSave,
    onChangeStock,
    onError,
    data,
}) => {
    const currentUser = useSelector((state) => state.userReducer);

    return<>
    <Modal show={isOpen} onClose={onClose} size={'md'} dismissible>
            <ModalHeader >Edit Inventory</ModalHeader>
            <ModalBody>
                <div className='space-y-2'>
                    <div className='mb-2 block'>
                        <Label value='Product' className='font-bold' />
                        <p>{data && data.product}</p>
                    </div>
                    <div className={`mb-2 block ${currentUser.role !== 'super' && 'hidden'}`}>
                        <Label value='Store' className='font-bold' />
                        <p>{data && data.store}</p>
                    </div>
                    <div className='mb-2 block'>
                        <Label value='Stock' className='font-bold' />
                        <TextInput
                            type='number'
                            value={data && data.stock}
                            min={0}
                            placeholder='Stock'
                            onChange={(e) => { onChangeStock(e) }}
                            color={onError && 'failure'}
                            helperText={onError && 'Stock is required'}
                            required
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className='justify-end'>
                <Button color='blue' onClick={onSave}>Save</Button>
                <Button color='blue' onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    </>
}

export default ModalEditInventory;