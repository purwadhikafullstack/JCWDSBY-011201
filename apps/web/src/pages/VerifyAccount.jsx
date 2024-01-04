import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import API_CALL from '../helpers/API';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';
import { useSelector } from 'react-redux';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const globalUserRole = useSelector((reducer) => reducer.userReducer.role);

  if (globalUserRole) {
    if (globalUserRole === 'user') {
      return <Navigate to={'/'} replace={true} />;
    } else if (globalUserRole === 'admin' || globalUserRole === 'super') {
      return <Navigate to={'/manage/dashboard'} replace={true} />;
    }
  }

  const handleVerify = async (data) => {
    try {
      setIsLoading(true);
      if (searchParams.get('key')) {
        const token = searchParams.get('key');
        const result = await API_CALL.patch('/auth/verify-account', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (result.data.success) {
          customToast('success', result.data.message);
          navigate('/login', { replace: true });
        }
      } else {
        customToast('error', 'Invalid verify token');
      }
    } catch (error) {
      console.log(error.message);
      customToast('error', error.response.data.message);
    }
    setIsLoading(false);
  };

  const verifySchema = Yup.object({
    password: Yup.string()
      .min(8, 'Minimum password length is 8')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain uppercase letter, lowercase letter, number, and no space',
      )
      .required('Required'),
    confPass: Yup.string()
      .oneOf([Yup.ref('password')], 'Password confirmation not match')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confPass: '',
    },
    validationSchema: verifySchema,
    onSubmit: (values) => {
      handleVerify(values);
    },
  });

  return (
    <div className="container lg:w-[1024px] m-auto h-screen">
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div className="title mb-2">
                <span className="text-3xl font-bold">Verify Account</span>
              </div>
              <div className="mb-1">
                <label
                  for="password"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Create New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Input new password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span
                  className={`${
                    formik.touched.password && formik.errors.password
                      ? ''
                      : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.password || 'Correct'}
                </span>
              </div>
              <div className="mb-1">
                <label
                  for="confPass"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confPass"
                  name="confPass"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confPass}
                  placeholder="Input new password again"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span
                  className={`${
                    formik.touched.confPass && formik.errors.confPass
                      ? ''
                      : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.confPass || 'Correct'}
                </span>
              </div>
              <ButtonWithLoading
                isLoading={isLoading}
                func={formik.handleSubmit}
              >
                Verify
              </ButtonWithLoading>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
