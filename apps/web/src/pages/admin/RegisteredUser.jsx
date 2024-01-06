import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge } from "flowbite-react";

const RegisteredUser = () => {
    return <>
    <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
        <AdminSidebar />
        <LayoutPageAdmin title='Registered User'>
        <div className='relative w-[255px] max-w-full overflow-x-auto '>
            <Table>
                <TableHead>
                    <TableHeadCell>#</TableHeadCell>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Email</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                </TableHead>
                <TableBody className='divide-y divide-solid divide-slate-400'>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>Fahmi Ardiansyah</TableCell>
                        <TableCell>ardiansyah@cosmo.com</TableCell>
                        <TableCell><Badge color={'success'} className='w-fit'>VERIFIED</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>Wahyu Widiantoro</TableCell>
                        <TableCell>wahyu@cosmo.com</TableCell>
                        <TableCell><Badge color={'failure'} className='w-fit'>UNVERIFIED</Badge></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        </LayoutPageAdmin>
    </div>
    </>
};

export default RegisteredUser;