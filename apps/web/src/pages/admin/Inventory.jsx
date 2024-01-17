import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Select, Pagination } from "flowbite-react";
import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import ModalAddInventory from "../../components/modal/ModalAddInventory";
import { toast } from 'react-toastify';
import ModalConfirm from '../../components/modal/ModalConfirm';
import ModalEditInventory from "../../components/modal/ModalEditInventory";
import { useSearchParams } from "react-router-dom";

const Inventory = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentUser = useSelector(state => state.userReducer);
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [store, setStore] = useState(null);
    const [selectedStore, setSelectedStore] = useState('all');
    const [openModal, setOpenModal] = useState({
        add: false,
        edit: false,
        confirmAdd: false,
        confirmEdit: false
    });
    const [required, setRequired] = useState({
        addStock: false,
        editStock: false,
    });
    const [data, setData] = useState({
        productId: null,
        storeId: null,
        stock: null,
    });
    const [editData, setEditData] = useState({
        invId: null,
        product: null,
        store: null,
        stock: null,
    });

    useEffect(() => {
        getData();
        getStore();
    }, [])

    useEffect(() => {
        getData();
    }, [selectedStore])

    const getStore = async () => {
        try {
            setIsLoading(true);
            const resStore = await API_CALL.get('store', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setStore(resStore.data.result.raw);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const getData = async () => {
        setIsLoading(true);
        if (currentUser.role === 'super') {
            const res = await API_CALL.get(`${selectedStore === 'all' ? 'inventory' : `inventory?store=${selectedStore}`}`);
            if (res) {
                setItems(res.data.result.data);
                setIsLoading(false);
            }
        }
        if (currentUser.role === 'admin') {
            const res = await API_CALL.get(`inventory?admin=${currentUser.email}`);
            if (res) {
                setItems(res.data.result.data);
                setIsLoading(false);
            }
        }

    };

    const handleEdit = (id) => {
        setOpenModal({ ...openModal, edit: true });
        setEditData({
            invId: id,
            product: items.find(item => item.id === id).product.name,
            store: items.find(item => item.id === id).store.name,
            stock: items.find(item => item.id === id).stock
        });
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        const res = await API_CALL.delete(`/product/inventory/${id}`);
        if (res) {
            getData();
            setIsLoading(false);
        }
    };

    const handleAddInventory = async () => {
        try {
            if (!data.stock) {
                setRequired({ ...required, addStock: true });
                return setOpenModal({ ...openModal, add: true, confirmAdd: false });
            }
            setRequired({ ...required, addStock: false });
            const inventoryData = {
                productId: parseInt(data.productId),
                storeId: parseInt(data.storeId),
                stock: parseInt(data.stock),
            };
            setOpenModal({ ...openModal, add: false, confirmAdd: false });
            setIsLoading(true);
            await API_CALL.post('inventory', inventoryData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setIsLoading(false);
            getData();
        } catch (error) {
            setOpenModal({ ...openModal, add: false, confirmAdd: false });
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

    const handleEditInventory = async () => {
        if (!editData.stock) {
            setRequired({ ...required, editStock: true });
            return setOpenModal({ ...openModal, edit: true, confirmEdit: false });
        }
        setRequired({ ...required, editStock: false });
        setOpenModal({ ...openModal, edit: false, confirmEdit: false });
        setIsLoading(true);
        await API_CALL.patch(`inventory/${editData.invId}`, {
            stock: parseInt(editData.stock),
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        setIsLoading(false);
        getData();
    };

    const printData = (data) => {
        if (data) {
            return data.map((item, index) => {
                return <TableRow key={index}>
                    <TableCell>{`${index + 1}`}</TableCell>
                    <TableCell>{`${item.product.name}`}</TableCell>
                    <TableCell>{`${item.product.category.name}`}</TableCell>
                    <TableCell>{`${item.stock}`}</TableCell>
                    {currentUser.role === 'super' && <TableCell>{`${item.store.name}`}</TableCell>}
                    <TableCell className='space-y-1'>
                        <p className='text-blue-600' onClick={() => handleEdit(item.id)}>Edit</p>
                        <p className='text-red-600' onClick={() => handleDelete(item.id)}>Delete</p>
                    </TableCell>
                </TableRow>
            });
        }
    };

    const storeOption = () => {
        return store && store.map((item, index) => {
            return (
                <option key={index} value={item.UUID}>{item.name}</option>
            )
        })
    };

    return <>
        <div className='flex flex-row container bg-blue-100 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LoadingSpinner isLoading={isLoading} size={20} />
            <ModalConfirm
                show={openModal.confirmAdd || openModal.confirmEdit}
                onClose={() => setOpenModal({ ...openModal, confirmAdd: false, confirmEdit: false })}
                onConfirm={openModal.confirmAdd ? handleAddInventory : handleEditInventory}
                header={openModal.confirmAdd ? 'Add Inventory' : 'Edit Inventory'}
                message={openModal.confirmAdd ? 'Are you sure you want to add inventory?' : 'Are you sure you want to edit inventory?'}
            />
            <LayoutPageAdmin title='Manage Inventory'>
                <div className='grid grid-cols-1 max-w-full overflow-x-auto '>
                    <div className='mb-2'>
                        <div className='flex items-start flex-col gap-3 lg:flex-row lg:justify-between'>
                            <div>
                                <Button size={'xs'} color='blue' onClick={() => setOpenModal({ ...openModal, add: true })} ><FaPlus className='mr-1' /> Add Inventory</Button>
                            </div>
                            <div className={`flex gap-2 items-center ${currentUser.role !== 'super' && 'hidden'}`}>
                                <span>Store : </span>
                                <Select onChange={(e) => setSelectedStore(e.target.value)}>
                                    <option value={'all'}>All</option>
                                    {storeOption()}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <p className={`${items.length && 'hidden'}`}>Data not available</p>
                    <Table className={`${!items.length && 'hidden'}`}>
                        <TableHead>
                            <TableHeadCell>#</TableHeadCell>
                            <TableHeadCell>Product Name</TableHeadCell>
                            <TableHeadCell>Category</TableHeadCell>
                            <TableHeadCell>Stock</TableHeadCell>
                            {currentUser.role === 'super' && <TableHeadCell>Store</TableHeadCell>}
                            <TableHeadCell>Action</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {printData(items)}
                        </TableBody>
                    </Table>
                    <ModalAddInventory
                        isOpen={openModal.add}
                        onClose={() => { setOpenModal({ ...openModal, add: false }); setRequired({ ...required, addStock: false }); }}
                        onAdd={(e) => { setData({ ...data, productId: e.productId, storeId: e.storeId, stock: e.stock }); setOpenModal({ ...openModal, confirmAdd: true }); }}
                        onError={required.addStock}
                    />
                    <ModalEditInventory
                        isOpen={openModal.edit}
                        onClose={() => { setOpenModal({ ...openModal, edit: false }); setRequired({ ...required, editStock: false }); }}
                        data={editData}
                        onChangeStock={(e) => { setEditData({ ...editData, stock: e.target.value }); setRequired({ ...required, editStock: false }); }}
                        onError={required.editStock}
                        onSave={() => setOpenModal({ ...openModal, confirmEdit: true })}
                    />
                    <div className='flex lg:justify-center'>
                        <Pagination
                            // currentPage={1}
                            // totalPages={5}
                            layout='pagination'
                            currentPage={Number(searchParams.get('page')) || 1}
                            totalPages={2}
                            // onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default Inventory;