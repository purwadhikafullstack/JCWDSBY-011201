import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge } from "flowbite-react";
import API_CALL from '../../helpers/API';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import LayoutDashboard from '../../components/LayoutDashboard';
import { customTable } from '../../helpers/flowbiteCustomTheme';
import { useSearchParams } from 'react-router-dom';
import ResponsivePagination from '../../components/ResponsivePagination';
import { onPageChange } from '../../helpers/pagination';

const RegisteredUser = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
	const [totalPage, setTotalPage] = useState(1);
	const queryParam = { limit: 10, page: searchParams.get('page') }

  useEffect(() => {
    getUsers();
  }, [searchParams.get('page')]);

  const getUsers = async () => {
    setIsLoading(true);
    const res = await API_CALL.get('/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
      params: queryParam
    })
    if (res) {
      setUsers(res.data.result.rows);
      setTotalPage(res.data.result.totalPage)
      setIsLoading(false);
    }
  };

  const printUser = () => {
    return users.map((user, index) => {
      return (
        <TableRow key={index}>
          <TableCell className="text-center">{`${((searchParams.get('page') || 1) - 1) * 10 + index + 1}`}</TableCell>
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
    <LayoutDashboard>
      <LoadingSpinner isLoading={isLoading} size={16} />
      <LayoutPageAdmin title='Registered User'>
        <div className='grid grid-cols-1 overflow-x-auto '>
          <Table theme={customTable} >
            <TableHead>
              <TableHeadCell>#</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableHead>
            <TableBody className='divide-y divide-solid divide-slate-400'>
              {printUser()}
            </TableBody>
          </Table>
        </div>
        <div className='mt-5'>
        <ResponsivePagination
					currentPage={Number(searchParams.get('page')) || 1}
					totalPages={totalPage}
					onPageChange={(page) => onPageChange(page, setSearchParams)}
				/>
        </div>
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default RegisteredUser;