import { useNavigate, useSearchParams } from 'react-router-dom';
import cosmoLogo from '../assets/cosmo-logo.svg';
import API_CALL from '../helpers/API';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slice/userSlice';
import InputPassword from '../components/InputPassword';
import Container from '../components/Container';
import CosmoTextLogo from '../components/CosmoTextLogo';

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerify = async (data) => {
    try {
      setIsLoading(true);
      if (searchParams.get('key')) {
        const token = searchParams.get('key');
        const result = await API_CALL.patch(
          '/auth/forgot/reset-password',
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (result.data.success) {
          localStorage.removeItem('authToken');
          dispatch(logout());
          customToast('success', result.data.message);
          navigate('/login', { replace: true });
        }
      } else {
        customToast('error', 'Invalid reset token');
      }
    } catch (error) {
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
    <Container>
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center py-6">
            <div className="flex flex-col w-full md:w-[500px] p-6 lg:p-8 border rounded-lg overflow-hidden shadow-lg">
              <div className="flex items-center justify-center gap-2 py-3 drop-shadow-md">
                <img className="w-16 h-16" src={cosmoLogo} alt="" />
                <CosmoTextLogo size={'text-6xl'} />
              </div>
              <div className="title mb-2">
                <span className="text-3xl font-bold">Reset Password</span>
              </div>
              <div className="mb-1">
                <label
                  for="password"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Create New Password
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
              <div className="mb-1">
                <label
                  for="confPass"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Confirm Password
                </label>
                <InputPassword
                  id={'confPass'}
                  name={'confPass'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confPass}
                  placeholder="Input new password again"
                  HelperText={
                    <span
                      className={`${
                        formik.touched.confPass && formik.errors.confPass
                          ? ''
                          : 'invisible'
                      } text-xs text-red-500`}
                    >
                      {formik.errors.confPass || 'Correct'}
                    </span>
                  }
                />
              </div>
              <ButtonWithLoading
                isLoading={isLoading}
                func={formik.handleSubmit}
              >
                Reset Password
              </ButtonWithLoading>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NewPassword;
