import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge } from "flowbite-react";
import API_CALL from '../../helpers/API';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';

const RegisteredUser = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getUsers();
    },[]);

    const getUsers = async () => {
        const res = await API_CALL.get('/user')
        if(res){
            setUsers(res.data);
        }
    };

    const printUser = () => {
        return users.map((user, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    {user.isVerified ? 
                    <TableCell><Badge color='success' className='w-fit'>Verified</Badge></TableCell> :
                    <TableCell><Badge color='failure' className='w-fit'>Not Verified</Badge></TableCell>
                    }
                </TableRow>
            )
        })
    }

    return <>
    <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
        <AdminSidebar />
            <LoadingSpinner isLoading={isLoading} size={16}/>
        <LayoutPageAdmin title='Registered User'>
        <div className='grid grid-cols-1 overflow-x-auto '>
            <Table>
                <TableHead>
                    <TableHeadCell>#</TableHeadCell>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Email</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                </TableHead>
                <TableBody className='divide-y divide-solid divide-slate-400'>
                    {printUser()}
                    {/* <TableRow>
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
                    </TableRow> */}
                </TableBody>
            </Table>
        </div>
        </LayoutPageAdmin>
    </div>
    </>
};

export default RegisteredUser;