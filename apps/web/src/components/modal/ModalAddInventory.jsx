import { Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Button, Select } from "flowbite-react";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import API_CALL from '../../helpers/API';
import capitalize from '../../helpers/capitalize';

const ModalAddInventory = ({
    isOpen,
    onAdd,
    onClose,
    onError,
}) => {
    const currentUser = useSelector((state) => state.userReducer);
    const [productData, setProductData] = useState(null);
    const [storeData, setStoreData] = useState(null);
    const [data, setData] = useState({
        productId: null,
        storeId: null,
        stock: null,
    });

    useEffect(() => {
        getData();
    }, [isOpen]);

    const getData = async () => {
        try {
            const resProduct = await API_CALL.get('product');

            if (currentUser.role === 'super') {
                const resStore = await API_CALL.get('store', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                setData({ ...data, productId: resProduct.data.result.data[0].id, storeId: resStore.data.result.data[0].id });
                setStoreData(resStore.data.result.raw);
            }
            if (currentUser.role === 'admin') {
                setData({ ...data, productId: resProduct.data.result.data[0].id });
            }

            setProductData(resProduct.data.result.data);
        } catch (error) {
            console.error(error);
        }
    };

    const productOption = () => {
        return productData && productData.map((item, index) => {
            return (
                <option key={index} value={item.id}>{capitalize(item.name)}</option>
            )
        })
    };

    const storeOption = () => {
        return storeData && storeData.map((item, index) => {
            return (
                <option key={index} value={item.id}>{item.name}</option>
            )
        })
    };

    const handleOnClose = () => {
        onClose();
        onClose && setData({...data, productId: null, storeId: null, stock: '' });
    };
    
    return <>
        <Modal show={isOpen} onClose={handleOnClose} size={'md'} dismissible>
            <ModalHeader >Add Inventory</ModalHeader>
            <ModalBody>
                <div className='space-y-2'>
                    <div className='mb-2 block'>
                        <Label value='Product' className='font-bold' />
                        <Select onChange={(e) => { setData({ ...data, productId: e.target.value }) }} >
                            {productOption()}
                        </Select>
                    </div>
                    <div className={`mb-2 block ${currentUser.role !== 'super' && 'hidden'}`}>
                        <Label value='Store' className='font-bold' />
                        <Select onChange={(e) => { setData({...data, storeId: e.target.value }) }} >
                            {storeOption()}
                        </Select>
                    </div>
                    <div className='mb-2 block'>
                        <Label value='Stock' className='font-bold' />
                        <TextInput
                            type='number'
                            min={0}
                            placeholder='Stock'
                            onChange={(e) => { setData({ ...data, stock: e.target.value }) }}
                            color={onError && 'failure'}
                            helperText={onError && 'Stock is required'}
                            required
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className='justify-end'>
                <Button color='blue' onClick={() => onAdd(data)}>Add</Button>
                <Button color='blue' onClick={handleOnClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    </>
};

export default ModalAddInventory;