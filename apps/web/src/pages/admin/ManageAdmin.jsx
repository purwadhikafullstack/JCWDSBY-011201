import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { Button } from "flowbite-react";
import { IoMdAdd } from "react-icons/io";
import ModalAdminStore from '../../components/modal/ModalAdminStore';
import { useEffect, useState } from 'react';
import API_CALL from '../../helpers/API';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModalConfirm from '../../components/modal/ModalConfirm';
import LayoutDashboard from '../../components/LayoutDashboard';
import { customButton } from '../../helpers/flowbiteCustomTheme';
import customToast from '../../utils/toast';
import ManageAdminTable from '../../components/table/ManageAdminTable';
import ResponsivePagination from '../../components/ResponsivePagination';
import { onPageChange } from '../../helpers/pagination';


const ManageAdmin = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [userAdmin, setUserAdmin] = useState([]);
	const [UUID, setUUID] = useState('');
	const [editData, setEditData] = useState(null);
	const [openModal, setOpenModal] = useState({ add: false, edit: false, delete: false });
	const [searchParams, setSearchParams] = useSearchParams();
	const [totalPage, setTotalPage] = useState(1);
	const queryParam = { limit: 10, page: searchParams.get('page') }

	useEffect(() => {
		getAdmin();
	}, [searchParams.get('page')]);

	const getAdmin = async () => {
		setIsLoading(true);
		const result = await API_CALL.get('admin', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
			params: queryParam
		});
		if (result) {
			setUserAdmin(result.data.result.rows);
			setTotalPage(result.data.result.totalPage);
			setIsLoading(false);
		}
	};

	const handleDelete = async (uuid) => {
		setIsLoading(true);
		const res = await API_CALL.delete(`/admin/${uuid}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			}
		});
		if (res) {
			toast.success('Admin deleted successfully');
			setUUID('');
			setOpenModal({ ...openModal, delete: false });
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
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				}
			});
			setIsLoading(false);
			getAdmin();
		} catch (error) {
			setIsLoading(false);
			if (error.response.data.message) return customToast('error', error.response.data.message)
		}
	};

	return <>
		<LayoutDashboard>
			<LoadingSpinner isLoading={isLoading} size={16} />
			<ModalConfirm
				show={openModal.delete}
				type={'submit'}
				onClose={() => setOpenModal({ ...openModal, delete: false })}
				onConfirm={() => handleDelete(UUID)}
				header={'Delete Admin'}
				message={'Are you sure you want to delete admin account?'}
			/>
			<LayoutPageAdmin title='Manage Admin'>
				<div className='mb-3 mt-3'>
					<Button theme={customButton} size={'xs'} color='secondary' onClick={() => setOpenModal({ ...openModal, add: true })}>
						<IoMdAdd className='mr-1 w-4 h-4' />
						Add Admin
					</Button>
					<ModalAdminStore
						show={openModal.add || openModal.edit}
						onSubmit={(val) => handleAddButton(val)}
						onClose={() => setOpenModal({ ...openModal, add: false, edit: false })}
						onEdit={openModal.edit}
						initialValue={{ name: editData?.name, email: editData?.email }}
					/>
				</div>
				<div className='mb-5'>
					<ManageAdminTable
						data={userAdmin}
						page={(searchParams.get('page') || 1)}
						// onEdit={(val) => { setEditData(val); setOpenModal({ ...openModal, edit: true }) }}
						onEdit={(val) => navigate(`/manage/admin/profile?key=${val.uuid}`)}
						onChangePassword={(uuid) => navigate(`/manage/admin/password?key=${uuid}`)}
						onDelete={(uuid) => { setOpenModal({ ...openModal, delete: true }); setUUID(uuid) }}
					/>
				</div>
				<ResponsivePagination
					currentPage={Number(searchParams.get('page')) || 1}
					totalPages={totalPage}
					onPageChange={(page) => onPageChange(page, setSearchParams)}
				/>
			</LayoutPageAdmin>
		</LayoutDashboard>
	</>
};

export default ManageAdmin;