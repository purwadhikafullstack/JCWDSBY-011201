import banner from '../assets/login-banner.jpg';
import cosmoLogo from '../assets/cosmo-logo.svg';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API_CALL from '../helpers/API';
import ButtonWithLoading from '../components/ButtonWithLoading';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import customToast from '../utils/toast';
import LoginWithGoogle from '../components/LoginWithGoogle';
import Container from '../components/Container';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slice/userSlice';
import InputPassword from '../components/InputPassword';
import CosmoTextLogo from '../components/CosmoTextLogo';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
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
      const result = await API_CALL.post('/auth/login', data);
      if (result.data.success) {
        dispatch(login(result.data.result));
        localStorage.setItem('authToken', result.data.result.token);
        customToast('success', `Welcome ${result.data.result.name}`);
        navigate(location.state?.previousPath || '/', { replace: true });
      }
    } catch (error) {
      if (error.response.status !== 500) {
        customToast('error', error.response.data.message);
      } else {
        customToast('error', 'Failed to login');
      }
    }
    setIsloading(false);
  };

  const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string()
      .min(8, 'Minimum password length is 8')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <Container>
      <div className="flex w-full h-full items-center justify-center max-sm:p-2">
        <div className="flex w-full lg:w-[1000px] border rounded-lg overflow-hidden shadow-lg ">
          <div className="img-container hidden lg:flex w-full h-full] relative">
            <img className="w-full h-full object-cover" src={banner} alt="" />
          </div>
          <div className="header flex flex-col w-full h-full py-6">
            <div className="flex w-full h-full justify-center">
              <div className="flex flex-col w-full p-6 lg:p-8">
                <div className="flex items-center justify-center gap-2 py-3 drop-shadow-md">
                  <img className="w-16 h-16" src={cosmoLogo} alt="" />
                  <CosmoTextLogo size={'text-6xl'} />
                </div>
                <div className="title mb-2">
                  <span className="text-3xl font-bold">Welcome to Cosmo</span>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="email"
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
                    placeholder="Input your email address"
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
                <div className="flex justify-between mb-3">
                  <span className=" text-gray-500 text-sm">
                    Forgot your password?
                  </span>
                  <span
                    className=" text-blue-900 font-bold text-sm cursor-pointer"
                    onClick={() => {
                      navigate('/forgot');
                    }}
                  >
                    Forgot Password
                  </span>
                </div>
                <ButtonWithLoading
                  isLoading={isLoading}
                  func={formik.handleSubmit}
                >
                  Login
                </ButtonWithLoading>
                <div className="flex justify-between mb-5">
                  <span className=" text-gray-500 text-sm">
                    Don't have an account yet?
                  </span>
                  <span
                    className=" text-blue-900 font-bold text-sm cursor-pointer"
                    onClick={() => {
                      navigate('/signup');
                    }}
                  >
                    Sign Up
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-2">
                    Other method
                  </span>
                  <LoginWithGoogle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
