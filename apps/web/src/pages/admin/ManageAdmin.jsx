import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import { IoMdAdd } from "react-icons/io";
import ModalAdminStore from '../../components/ModalAdminStore';
import { useEffect, useState } from 'react';
import API_CALL from '../../helpers/API';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from '../../components/ModalConfirm';

const ManageAdmin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userAdmin, setUserAdmin] = useState([]);
    const [UUID, setUUID] = useState('');
    const [openModal, setOpenModal] = useState({
        add: false,
        delete: false,
    });

    

    const getAdmin = async () => {
        console.log('Getting Admin Information');
        setIsLoading(true);
        const response = await API_CALL.get('/admin');
        if (response) {
            setUserAdmin(response.data);
            setIsLoading(false);
        }
    };

    const printData = () => {
        if (userAdmin.length > 0) {
            return userAdmin.map((item, index) => {
                return (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell className='space-y-1'>
                            <p className='text-blue-600' onClick={() => navigate(`/manage/admin/profile?key=${item.uuid}`)}>Edit</p>
                            <p className='text-blue-600' onClick={() => navigate(`/manage/admin/password?key=${item.uuid}`)}>Change Password</p>
                            <p className='text-red-600' onClick={() => {setOpenModal({...openModal, delete: true});  setUUID(item.uuid) }}>Delete</p>
                        </TableCell>
                    </TableRow>
                )
            })
        }
    };

    const handleDelete = async (uuid) => {
        setIsLoading(true);
        const res = await API_CALL.delete(`/admin/${uuid}`);
        if (res) {
            toast.success('Admin deleted successfully');
            setUUID('');
            setOpenModal({...openModal, delete: false});
            getAdmin();
        }
    };

    const handleAddButton = async (data) => {
        try {
            setOpenModal(false);
            setIsLoading(true)
            await API_CALL.post('/admin', {
                name: data.name,
                email: data.email,
                password: data.password,
            });
            setIsLoading(false);
            getAdmin();
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) return toast.error(error.response.data.message, {
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

    useEffect(() => {
        getAdmin();
    }, []);

    return <>
        <div className='flex flex-row container bg-blue-100 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LoadingSpinner isLoading={isLoading} size={16} />
            <ModalConfirm
                    show={openModal.delete}
                    type={'submit'}
                    onClose={() => setOpenModal({...openModal, delete: false})}
                    onConfirm={() => handleDelete(UUID)}
                    header={'Delete Admin'}
                    message={'Are you sure you want to delete admin account?'}
                />
            <LayoutPageAdmin title='Manage Admin'>
                <div className='mb-3 mt-3'>
                    <Button size={'xs'} color='blue' onClick={() => setOpenModal({...openModal, add: true })}>
                        <IoMdAdd className='mr-1 w-4 h-4' />
                        Add Admin
                    </Button>
                    <ModalAdminStore
                        show={openModal.add}
                        onSubmit={(val) => handleAddButton(val)}
                        onClose={() => setOpenModal({...openModal, add: false })}
                    />
                </div>
                <div className='grid grid-cols-1 overflow-x-auto '>
                    <Table>
                        <TableHead>
                            <TableHeadCell>#</TableHeadCell>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Action</TableHeadCell>
                        </TableHead>
                        <TableBody className='divide-y divide-solid divide-slate-400'>
                            {printData()}
                        </TableBody>
                    </Table>
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageAdmin;