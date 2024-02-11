import banner from '../assets/login-banner.jpg';
import cosmoLogo from '../assets/cosmo-logo.svg';
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
import Container from '../components/Container';
import CosmoTextLogo from '../components/CosmoTextLogo';

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
      if (error.response.status !== 500) {
        customToast('error', error.response.data.message);
      } else {
        customToast('error', 'Failed to Signup');
      }
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
    <Container>
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex w-full lg:w-[1000px] border rounded-lg overflow-hidden shadow-lg">
          <div className="img-container hidden lg:flex w-full h-full] relative">
            <img className="w-full h-full object-cover" src={banner} alt="" />
          </div>
          <div className="header flex flex-col w-full h-full py-6">
            <div className="flex items-center justify-center gap-2 py-3 drop-shadow-md">
              <img className="w-16 h-16" src={cosmoLogo} alt="" />
              <CosmoTextLogo size={'text-6xl'} />
            </div>
            <div className="flex w-full h-full justify-center">
              <div className="flex flex-col w-full p-6 lg:p-8">
                <div className="title mb-2">
                  <span className="text-3xl font-bold">
                    Welcome Cosmo Admin
                  </span>
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
    </Container>
  );
};

export default LoginAdmin;
