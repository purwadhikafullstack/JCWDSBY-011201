import { Navigate, useNavigate } from 'react-router-dom';
import API_CALL from '../helpers/API';
import { useEffect, useState } from 'react';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';
import SignUpWithGoogle from '../components/SignUpWithGoogle';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const globalUserRole = useSelector((reducer) => reducer.userReducer.role);

  if (globalUserRole) {
    if (globalUserRole === 'user') {
      return <Navigate to={'/'} replace={true} />;
    } else if (globalUserRole === 'admin' || globalUserRole === 'super') {
      return <Navigate to={'/manage/dashboard'} replace={true} />;
    }
  }

  const handleSignup = async (data) => {
    try {
      setIsLoading(true);
      const result = await API_CALL.post('/auth/signup', data);
      if (result.data.success) {
        customToast('success', result.data.message);
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
    setIsLoading(false);
  };

  const signUpScheme = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    name: Yup.string()
      .matches(/^[A-Z]([a-zA-Z]|\.| |-|')+$/, 'Invalid name format')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: signUpScheme,
    onSubmit: (values) => {
      handleSignup(values);
    },
  });

  return (
    <div className="container lg:w-[1024px] m-auto h-screen">
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div className="title mb-2">
                <span className="text-3xl font-bold">Register to Cosmo</span>
              </div>
              <div className="mb-2">
                <label
                  for="name"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  placeholder="Input your full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span
                  className={`${
                    formik.touched.name && formik.errors.name ? '' : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.name || 'Correct'}
                </span>
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
                  placeholder="Input your email"
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
                Sign Up
              </ButtonWithLoading>
              <div className="flex justify-between mb-5">
                <span className=" text-gray-500 text-sm">
                  Already have an account?
                </span>
                <span
                  className=" text-blue-900 font-bold text-sm cursor-pointer"
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Login
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500 mb-2">Other method</span>
                <SignUpWithGoogle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
