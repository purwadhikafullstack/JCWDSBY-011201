import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import TopBar from "../../components/TopBar";
import { useEffect, useState } from "react";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Label, TextInput } from "flowbite-react";
import ModalConfirm from "../../components/modal/ModalConfirm";
import API_CALL from "../../helpers/API";
import LayoutDashboard from "../../components/LayoutDashboard";
import { customButton } from "../../helpers/flowbiteCustomTheme";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Minimum password length is 8')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain uppercase letter, lowercase letter, number, and no space',
    )
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password confirmation not match')
    .required('Required'),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [onOpen, setOnOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm({
        password: '',
        confirmPassword: '',
      });
      navigate('/manage/admin')
    },
  });

  useEffect(() => {
    getProfile(location.search.split('=')[1]);
  }, []);

  const getProfile = async (uuid) => {
    setIsLoading(true);
    const res = await API_CALL.get(`/admin/${uuid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (res) {
      setData(res.data.result);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (val) => {
    setIsLoading(true);
    await API_CALL.patch(`/admin/${data.uuid}`, { password: val.password }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    setIsLoading(false);
  }

  const handleSaveButton = () => {
    if (!formik.errors.password && !formik.errors.confirmPassword) {
      setOnOpen(true)
    }
  };

  const onCancel = () => {
    navigate('/manage/admin');
  };

  return <>
    <LayoutDashboard>
      <div className='w-full'>
        <TopBar title='Change Password' prevPage={onCancel} />
        <LoadingSpinner size={16} isLoading={isLoading} />
        <div className="lg:w-[35%] mx-2 lg:mx-auto border shadow-md pb-7 mt-5">
          <form onSubmit={formik.handleSubmit} id='formChangePassword'>
            <ModalConfirm
              show={onOpen}
              type={'submit'}
              onClose={() => setOnOpen(false)}
              onConfirm={formik.onSubmit}
              formRef='formChangePassword'
              header={'Change Password'}
              message={'Are you sure you want to change password?'}
            />
            <div className='space-y-4 m-4'>
              <div>
                <Label className='font-bold'>Name</Label>
                <p>{data && data.name}</p>
              </div>
              <div>
                <Label className='font-bold'>Email</Label>
                <p>{data && data.email}</p>
              </div>
              <div>
                <Label className='font-bold' >Password</Label>
                <TextInput
                  placeholder='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && <span className='text-red-500'>{formik.errors.password}</span>}
              </div>
              <div>
                <Label className='font-bold'>Confirm Password</Label>
                <TextInput
                  placeholder='confirm password'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className='text-red-500'>{formik.errors.confirmPassword}</span>}
              </div>
            </div>
            <div className='flex justify-end gap-5 mt-10 mx-4'>
              <Button theme={customButton} color='primary' onClick={handleSaveButton}>Save</Button>
              <Button theme={customButton} color='secondary' onClick={onCancel}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </LayoutDashboard>
  </>
}

export default ChangePassword;