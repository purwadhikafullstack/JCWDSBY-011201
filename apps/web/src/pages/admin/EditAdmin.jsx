import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import ModalConfirm from "../../components/modal/ModalConfirm";
import { Button, Label, TextInput } from "flowbite-react";
import API_CALL from "../../helpers/API";
import LayoutDashboard from "../../components/LayoutDashboard";
import { customButton } from "../../helpers/flowbiteCustomTheme";

const validationSchema = Yup.object().shape({
	name: Yup.string()
		.matches(/^([a-zA-Z]|\.| |-|')+$/, 'Invalid name format')
		.required('Required'),
	email: Yup.string()
		.email('Invalid email address')
		.required('Required'),
});

const EditAdmin = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [onOpen, setOnOpen] = useState(false);
	const [profileUuid, setProfileUuid] = useState('');
	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
		},
		validationSchema: validationSchema,
		onSubmit: (values, { resetForm }) => {
			handleSubmit(values);
			resetForm({
				name: '',
				email: '',
			});
		},
	});

	useEffect(() => {
		getProfile(location.search.split('=')[1]);
	}, []);

	const getProfile = async (uuid) => {
		setIsLoading(true);
		const res = await API_CALL.get(`/admin/${uuid}`,{
			headers:{
				Authorization: `Bearer ${localStorage.getItem('authToken')}`
			}
		});
		
		if (res) {
			formik.initialValues.name = res.data.result.name;
			formik.initialValues.email = res.data.result.email;
			setProfileUuid(res.data.result.uuid);
			setIsLoading(false);
		}
	};

	const handleSubmit = async (val) => {
		setIsLoading(true);
		await API_CALL.patch(`/admin/profile/${profileUuid}`, { name: val.name, email: val.email }, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`
			}
		});
		setIsLoading(false);
		navigate('/manage/admin', { replace: true });
	};

	const handleSaveButton = () => {
		if (!formik.errors.name && !formik.errors.email) {
			setOnOpen(true)
		}
	};

	const onCancel = () => {
		navigate('/manage/admin');
	};

	return <>
		<LayoutDashboard>
			<div className='w-full'>
				<TopBar title='Edit Profile' prevPage={onCancel} />
				<LoadingSpinner size={16} isLoading={isLoading} />
				<div className='lg:w-[35%] mx-2 lg:m-auto border shadow-md mt-5 lg:mt-5'>
					<Formik enableReinitialize>
						<form onSubmit={formik.handleSubmit} id='formEditAdmin'>
							<ModalConfirm
								show={onOpen}
								type={'submit'}
								onClose={() => setOnOpen(false)}
								onConfirm={formik.onSubmit}
								formRef='formEditAdmin'
								header={'Edit Admin'}
								message={'Are you sure you want to update admin profile?'}
							/>
							<div className='space-y-4 m-4'>
								<div>
									<Label className='font-bold'>Name</Label>
									<TextInput
										placeholder='name'
										name='name'
										type='text'
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.name}
									/>
									{formik.touched.name && formik.errors.name && <span className='text-red-500'>{formik.errors.name}</span>}
								</div>
								<div>
									<Label className='font-bold'>Email</Label>
									<TextInput
										placeholder='email'
										name='email'
										type='email'
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.email}
									/>
									{formik.touched.email && formik.errors.email && <span className='text-red-500'>{formik.errors.email}</span>}
								</div>
								<div className='flex justify-end gap-5 mt-10 mx-4'>
									<Button theme={customButton} color='primary' onClick={handleSaveButton}>Save</Button>
									<Button theme={customButton} color='secondary' onClick={onCancel}>Cancel</Button>
								</div>
							</div>
						</form>
					</Formik>
				</div>
			</div>
		</LayoutDashboard>
	</>
};

export default EditAdmin;