import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Select, Pagination } from 'flowbite-react';
import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { useEffect, useState } from 'react';
import API_CALL from '../../helpers/API';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaPlus } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import ModalAddInventory from '../../components/modal/ModalAddInventory';
import { toast } from 'react-toastify';
import ModalConfirm from '../../components/modal/ModalConfirm';
import ModalEditInventory from '../../components/modal/ModalEditInventory';
import { useSearchParams } from 'react-router-dom';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { sortingInventory } from '../../constants/sorting';

const Inventory = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentUser = useSelector(state => state.userReducer);
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [store, setStore] = useState(null);
    const [category, setCategory] = useState(null);
    const [totalPage, setTotalPage] = useState(1);
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
        getCategory();
    }, [])

    useEffect(() => {
        getData();
    }, [searchParams])

    const onPageChange = (page) => {
        setSearchParams((prev) => {
            prev.set('page', page);
            return prev;
        });
    };

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

    const getCategory = async () => {
        try {
            setIsLoading(true);
            const resCategory = await API_CALL.get('category', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setCategory(resCategory.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const getData = async () => {
        setIsLoading(true);
        if (currentUser.role === 'super') {
            const res = await API_CALL.get('inventory', {
                params: { store: searchParams.get('store'), page: searchParams.get('page'), sort: searchParams.get('sort'), category: searchParams.get('category'), q: searchParams.get('q') },
            });
            if (res) {
                setItems(res.data.result.rows);
                setTotalPage(Math.ceil(res.data.result.count / 5));
                setIsLoading(false);
            }
        }
        if (currentUser.role === 'admin') {
            const res = await API_CALL.get(`inventory?admin=${currentUser.email}`);
            if (res) {
                setItems(res.data.result.rows);
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
                position: 'bottom-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
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
                    <TableCell>{`${((searchParams.get('page') || 1) - 1) * 5 + index + 1}`}</TableCell>
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
            if(searchParams.get('store') === item.UUID) {
                return <option key={index} value={item.UUID} selected>{item.name}</option>
            }
            return <option key={index} value={item.UUID}>{item.name}</option>
        })
    };

    const categoryOption = () => {
        return category && category.map((item, index) => {
            if(searchParams.get('category') === item.name) {
                return <option key={index} value={item.name} selected>{item.name}</option>
            }
            return <option key={index} value={item.name}>{item.name}</option>
        })
    };

    const handleFilterStore = (value) => {
        if (value === 'all') {
            searchParams.delete('store');
            searchParams.set('page', 1);
            return setSearchParams(searchParams)
        }
        searchParams.set('store', value);
        searchParams.set('page', 1);
        setSearchParams(searchParams)
    };

    const handleFilterCategory = (value) => {
        if (value === 'all') {
            searchParams.delete('category');
            searchParams.set('page', 1);
            return setSearchParams(searchParams)
        }
        searchParams.set('category', value);
        searchParams.set('page', 1);
        setSearchParams(searchParams)
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
                        <div className='grid grid-cols-1 grid-row-2 items-start gap-3 lg:justify-between'>
                            <div className='flex flex-col gap-3 justify-between lg:items-center lg:flex-row'>
                                <div>
                                    <Button size={'xs'} color='blue' onClick={() => setOpenModal({ ...openModal, add: true })} ><FaPlus className='mr-1' /> Add Inventory</Button>
                                </div>
                                <div>
                                    <div className='flex rounded-xl border-2 border-gray-500 focus-within:border-gray-700 p-1 overflow-hidden items-center gap-1'>
                                        <span className='w-6 h-6'>
                                            <HiMagnifyingGlass size={'100%'} />
                                        </span>
                                        <input
                                            type='search'
                                            defaultValue={searchParams.get('q')}
                                            placeholder='Search product name'
                                            onChange={(e) => {
                                                setTimeout(() => {
                                                    setSearchParams((prev) => {
                                                        if (e.target.value) {
                                                            prev.set('q', e.target.value);
                                                            searchParams.set('page', 1);
                                                        } else {
                                                            prev.delete('q');
                                                            searchParams.set('page', 1);
                                                        }
                                                        return prev;
                                                    });
                                                }, 1000);
                                            }}
                                            className=' outline-none bg-transparent'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-4 lg:flex-row'>
                                <div className={`flex justify-between items-center lg:gap-2 ${currentUser.role !== 'super' && 'hidden'}`}>
                                    <span className='font-bold'>Store : </span>
                                    <Select onChange={(e) => handleFilterStore(e.target.value)}>
                                        <option value={'all'}>All</option>
                                        {storeOption()}
                                    </Select>
                                </div>
                                <div className={`flex justify-between items-center lg:gap-2`}>
                                    <span className='font-bold'>Category : </span>
                                    <Select onChange={(e) => handleFilterCategory(e.target.value)}>
                                        <option value={'all'}>All</option>
                                        {categoryOption()}
                                    </Select>
                                </div>
                                <div className={`flex justify-between items-center lg:gap-2`}>
                                    <span className='font-bold'>Sort : </span>
                                    <Select onChange={(e) => { searchParams.set('sort', e.target.value); searchParams.set('page', 1); setSearchParams(searchParams); }}>
                                        {sortingInventory.map((value, index) => {
                                            if (searchParams.get('sort') === value.value) {
                                                return <option key={index} value={value.value} selected>{value.sortName}</option>
                                            }
                                            return <option key={index} value={value.value}>{value.sortName}</option>
                                        })}
                                    </Select>
                                </div>
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
                            layout='pagination'
                            currentPage={Number(searchParams.get('page')) || 1}
                            totalPages={totalPage}
                            onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default Inventory;