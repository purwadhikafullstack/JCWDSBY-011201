import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, Label, TextInput, ModalFooter } from "flowbite-react";
import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";
import LoadingSpinner from "../../components/LoadingSpinner";

const Inventory = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [productName, setProductName] = useState('');
    const [invId, setInvId] = useState('');
    const [stock, setStock] = useState(0);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        setIsLoading(true);
        const res = await API_CALL.get('/product/inventory');
        // console.log('res', res);
        if (res) {
            setItems(res.data);
            setIsLoading(false);
        }
    };

    const handleEdit = (id) =>{
        setOpenModal(true);
        setInvId(id);
        setProductName(items.find(item => item.id === id).product.name);
        setStock(items.find(item => item.id === id).stock);
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        const res = await API_CALL.delete(`/product/inventory/${id}`);
        // console.log('res', res);
        if (res) {
            getData();
            setIsLoading(false);
        }
    };

    const onChangeStock = (event) =>{
        if(parseInt(event.target.value) < 0){
            return setStock(0);
        }
        setStock(event.target.value);
    };

    const handleSaveButton = async () => {
        await API_CALL.patch(`product/inventory/${invId}`, {
            stock: stock
        })
        setOpenModal(false);
        getData();
    };

    const printData = (data) => {
        if (data) {
            return data.map((item, index) => {
                return <TableRow key={index}>
                    <TableCell>{`${item.product.name}`}</TableCell>
                    <TableCell>{`${item.product.category.name}`}</TableCell>
                    <TableCell>{`${item.stock}`}</TableCell>
                    <TableCell className='space-y-1'>
                        <p className='text-blue-600' onClick={() => handleEdit(item.id)}>Edit</p>
                        <p className='text-red-600' onClick={() => handleDelete(item.id)}>Delete</p>
                    </TableCell>
                </TableRow>
            });
        }
    };

    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LoadingSpinner isLoading={isLoading} size={20}/>
            <LayoutPageAdmin title='Manage Inventory'>
                <div className='relative w-[255px] max-w-full overflow-x-auto '>
                    <Table>
                        <TableHead>
                            <TableHeadCell>Product Name</TableHeadCell>
                            <TableHeadCell>Category</TableHeadCell>
                            <TableHeadCell>Stock</TableHeadCell>
                            <TableHeadCell>Action</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {printData(items)}
                        </TableBody>
                    </Table>
                    <Modal show={openModal} onClose={() => setOpenModal(false)} dismissible>
                        <ModalHeader >Edit Inventory</ModalHeader>
                        <ModalBody>
                            {/* <div className='space-y-2'> */}
                                <div className='mb-2 block'>
                                    <Label value='Product Name' />
                                </div>
                                <div className='mb-2 block'>
                                    <p className='font-bold'>{productName}</p>
                                </div>
                                <div className='mb-2 block'>
                                    <Label value='Stock' />
                                </div>
                                <TextInput type='number' value={stock} onChange={(e) => onChangeStock(e)} />
                            {/* </div> */}
                        </ModalBody>
                        <ModalFooter className='justify-end'>
                            <Button color='blue' onClick={handleSaveButton}>Save</Button>
                            <Button color='blue' onClick={() => setOpenModal(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default Inventory;