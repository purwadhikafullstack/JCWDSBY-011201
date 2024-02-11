import { HiChevronLeft } from 'react-icons/hi2';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';
import { useSelector } from 'react-redux';
import Container from '../components/Container';

const Forgot = () => {
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const globalUserRole = useSelector((reducer) => reducer.userReducer.role);

  if (globalUserRole) {
    if (globalUserRole === 'user') {
      return <Navigate to={'/'} replace={true} />;
    } else if (globalUserRole === 'admin' || globalUserRole === 'super') {
      return <Navigate to={'/manage/dashboard'} replace={true} />;
    }
  }

  const handleForgot = async (data) => {
    try {
      setIsloading(true);
      const result = await API_CALL.post('/auth/forgot', data);
      if (result.data.success) {
        customToast('success', result.data.message);
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
    setIsloading(false);
  };

  const forgotSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotSchema,
    onSubmit: (values) => {
      handleForgot(values);
    },
  });

  return (
    <Container>
      {' '}
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div
                className="back flex items-center text-blue-800 font-bold gap-2 mb-2 cursor-pointer"
                onClick={() => {
                  navigate('/login');
                }}
              >
                <HiChevronLeft />
                <span>Back to Login Page</span>
              </div>
              <div className="title mb-2">
                <span className="text-3xl font-bold">Forgot Password</span>
              </div>
              <div className="mb-1">
                <label
                  for="email"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="Input your registered email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span
                  className={`${
                    formik.touched.email && formik.errors.email
                      ? ''
                      : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.email || 'Correct'}
                </span>
              </div>
              <ButtonWithLoading
                isLoading={isLoading}
                func={formik.handleSubmit}
              >
                Send Reset Link
              </ButtonWithLoading>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Forgot;
