import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import { IoMdAdd } from "react-icons/io";
import ModalAdminStore from '../../components/ModalAdminStore';

const ManageAdmin = () => {
    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LayoutPageAdmin title='Manage Admin'>
                <div className='mb-3 mt-3'>
                    <Button size={'xs'} color='blue'>
                        <IoMdAdd className='mr-1 w-4 h-4'/>
                        Add Admin
                    </Button>
                    <ModalAdminStore show={true} />
                </div>
                <div className='relative w-[255px] max-w-full overflow-x-auto '>
                    <Table>
                        <TableHead>
                            <TableHeadCell>#</TableHeadCell>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Store</TableHeadCell>
                            <TableHeadCell>Action</TableHeadCell>
                        </TableHead>
                        <TableBody className='divide-y divide-solid divide-slate-400'>
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>admin1</TableCell>
                                <TableCell>adminsby@cosmo.com</TableCell>
                                <TableCell>Surabaya</TableCell>
                                <TableCell className='space-y-1'>
                                    <p className='text-blue-600' >Edit</p>
                                    <p className='text-red-600' >Delete</p>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>2</TableCell>
                                <TableCell>admin2</TableCell>
                                <TableCell>adminjkt@cosmo.com</TableCell>
                                <TableCell>Jakarta</TableCell>
                                <TableCell className='space-y-1'>
                                    <p className='text-blue-600' >Edit</p>
                                    <p className='text-red-600' >Delete</p>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageAdmin;