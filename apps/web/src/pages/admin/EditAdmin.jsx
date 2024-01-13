import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ModalConfirm from "../../components/ModalConfirm";
import { Button, Label, TextInput } from "flowbite-react";
import API_CALL from "../../helpers/API";

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
        const res = await API_CALL.get(`/admin/${uuid}`);
        if (res) {
            formik.initialValues.name = res.data.name;
            formik.initialValues.email = res.data.email;
            setProfileUuid(res.data.uuid);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (val) => {
        setIsLoading(true);
        await API_CALL.patch(`/admin/profile/${profileUuid}`, { name: val.name, email: val.email });
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
        <div className='flex flex-col container bg-blue-100 min-w-[360px] h-max min-h-screen'>
            <TopBar title='Edit Profile' prevPage={onCancel} />
            <LoadingSpinner size={16} isLoading={isLoading} />
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
                            autoComplete='name'
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
                            autoComplete='username'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && <span className='text-red-500'>{formik.errors.email}</span>}
                    </div>
                    <div className='grid grid-cols-2 gap-5 mt-10 mx-4'>
                        <Button color='blue' onClick={handleSaveButton}>Save</Button>
                        <Button color='blue' onClick={onCancel}>Cancel</Button>
                    </div>
                </div>

            </form>
        </div>
    </>
};

export default EditAdmin;