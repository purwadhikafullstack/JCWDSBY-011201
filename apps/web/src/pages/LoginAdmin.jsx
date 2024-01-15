import banner from '../assets/login-banner.jpg';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slice/userSlice';
import InputPassword from '../components/InputPassword';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const globalUserRole = useSelector((reducer) => reducer.userReducer.role);

  if (globalUserRole) {
    if (globalUserRole === 'user') {
      return <Navigate to={'/'} replace={true} />;
    } else if (globalUserRole === 'admin' || globalUserRole === 'super') {
      return <Navigate to={'/manage/dashboard'} replace={true} />;
    }
  }

  const handleLogin = async (data) => {
    try {
      setIsloading(true);
      const result = await API_CALL.post('/auth/login/admin', data);
      if (result.data.success) {
        dispatch(login(result.data.result));
        localStorage.setItem('authToken', result.data.result.token);
        customToast('success', `Welcome admin ${result.data.result.name}`);
        navigate('/manage/dashboard', { replace: true });
      }
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
    setIsloading(false);
  };

  const loginSchema = Yup.object({
    username: Yup.string().required('Required'),
    password: Yup.string()
      .min(8, 'Minimum password length is 8')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <div className="container lg:w-[1024px] m-auto h-screen overflow-auto">
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="img-container w-full h-[30%] relative">
            <img className="w-full h-full object-cover" src={banner} alt="" />
            <div className="text-container absolute top-0 w-full h-full flex justify-center items-center">
              <span className="text-7xl font-bold text-blue-900 drop-shadow-lg">
                COSMO
              </span>
            </div>
          </div>
          <div className="flex w-full h-full justify-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div className="title mb-2">
                <span className="text-3xl font-bold">Welcome Cosmo Admin</span>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="username"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Admin Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  placeholder="Input your admin username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span
                  className={`${
                    formik.touched.username && formik.errors.username
                      ? ''
                      : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.username || 'Correct'}
                </span>
              </div>
              <div className="mb-1">
                <label
                  htmlFor="password"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Password
                </label>
                <InputPassword
                  id={'password'}
                  name={'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Input your password"
                  HelperText={
                    <span
                      className={`${
                        formik.touched.password && formik.errors.password
                          ? ''
                          : 'invisible'
                      } text-xs text-red-500`}
                    >
                      {formik.errors.password || 'Correct'}
                    </span>
                  }
                />
              </div>
              <ButtonWithLoading
                isLoading={isLoading}
                func={formik.handleSubmit}
              >
                Login
              </ButtonWithLoading>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
