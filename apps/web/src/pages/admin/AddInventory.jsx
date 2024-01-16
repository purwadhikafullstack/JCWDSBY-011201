import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useState, useEffect } from 'react';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux'
import API_CALL from '../../helpers/API';
import capitalize from '../../helpers/capitalize';
import ModalConfirm from '../../components/ModalConfirm';
import { toast } from 'react-toastify';

const AddInventory = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector((state) => state.userReducer);
    const [store, setStore] = useState(null);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(false);
    const [onOpen, setOnOpen] = useState(false);
    const [data, setData] = useState({
        productId: null,
        storeId: null,
        stock: null,
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setIsLoading(true);
            const resProduct = await API_CALL.get('product');

            if (currentUser.role === 'super') {
                const resStore = await API_CALL.get('store', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                setData({ ...data, productId: resProduct.data.result.data[0].id, storeId: resStore.data.result.data[0].id });
                setStore(resStore.data.result.raw);
            }
            if (currentUser.role === 'admin') {
                setData({ ...data, productId: resProduct.data.result.data[0].id });
            }

            setProduct(resProduct.data.result.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const productOption = () => {
        return product && product.map((item, index) => {
            return (
                <option key={index} value={item.id}>{capitalize(item.name)}</option>
            )
        })
    };

    const storeOption = () => {
        return store && store.map((item, index) => {
            return (
                <option key={index} value={item.id}>{item.name}</option>
            )
        })
    };

    const onCreate = async () => {
        try {
            if (!data.stock) {
                setOnOpen(false);
                return setError(true);
            }
            console.log('Data >>> ', data);
            const InventoryData = {
                productId: parseInt(data.productId),
                storeId: parseInt(data.storeId),
                stock: parseInt(data.stock),
            };
            console.log('InventoryData >>> ', InventoryData);

            await API_CALL.post('inventory', InventoryData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return navigate('/manage/inventory');
        } catch (error) {
            setOnOpen(false);
            if (error.response.status === 409) return toast.error('Inventory already exists', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const onCancel = () => {
        navigate('/manage/inventory');
    };

    return <>
        <div className='flex flex-col bg-blue-100 min-w-[360px] h-max min-h-screen'>
            <TopBar title='Add Inventory' prevPage={onCancel} />
            <LoadingSpinner size={16} isLoading={isLoading} />
            <ModalConfirm
                show={onOpen}
                onClose={() => setOnOpen(false)}
                onConfirm={onCreate}
                header={'Add Inventory'}
                message={'Are you sure you want to add inventory?'}
            />
            <div className='container mx-auto w-[360px] px-3 py-5'>
                <form className='flex flex-col gap-4'>
                    <div>
                        <div className='mb-1 block'>
                            <Label value='Product' />
                        </div>
                        <Select onChange={(e) => { setData({ ...data, productId: e.target.value }) }} >
                            {productOption()}
                        </Select>
                    </div>
                    <div className={`${currentUser.role !== 'super' && 'hidden'}`}>
                        <div className='mb-1 block'>
                            <Label value='Store' />
                        </div>
                        <Select onChange={(e) => { setData({ ...data, storeId: e.target.value }) }} >
                            {storeOption()}
                        </Select>
                    </div>
                    <div>
                        <div className='mb-1 block'>
                            <Label value='Stock' />
                        </div>
                        <TextInput
                            type='number'
                            min={0}
                            placeholder='Stock'
                            onChange={(e) => { setData({ ...data, stock: e.target.value }); setError(false) }}
                            color={error && 'failure'}
                            helperText={error && 'Stock is required'}
                            required
                        />
                    </div>
                    <div className='flex gap-10 justify-center mt-5'>
                        <Button color='blue' onClick={() => setOnOpen(true)}>Create</Button>
                        <Button color='failure' onClick={onCancel}>Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    </>
};

export default AddInventory;