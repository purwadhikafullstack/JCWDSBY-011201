import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import API_CALL from '../helpers/API';
import { useRef, useState } from 'react';
import customToast from '../utils/toast';
import ButtonWithLoading from '../components/ButtonWithLoading';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const password = useRef();
  const confPass = useRef();

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      if (
        password.current.value === confPass.current.value &&
        password.current.value &&
        confPass.current.value
      ) {
        if (searchParams.get('key')) {
          const token = searchParams.get('key');
          const result = await API_CALL.patch(
            '/auth/verify-account',
            {
              password: password.current.value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (result.data.success) {
            customToast('success', result.data.message);
            navigate('/login');
          }
        }
      }
    } catch (error) {
      console.log(error.message);
      customToast('error', error.response.data.message);
    }
    setIsLoading(false);
  };
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
                  for="newPassword-input"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Create New Password
                </label>
                <input
                  type="password"
                  id="newPassword-input"
                  ref={password}
                  placeholder="Input new password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span className=" invisible text-xs text-red-500">tes</span>
              </div>
              <div className="mb-1">
                <label
                  for="confirmPassword-input"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword-input"
                  ref={confPass}
                  placeholder="Input new password again"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span className=" invisible text-xs text-red-500">tes</span>
              </div>
              <ButtonWithLoading isLoading={isLoading} func={handleVerify}>
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
