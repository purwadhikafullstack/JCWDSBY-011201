import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import ButtonWithLoading from '../components/ButtonWithLoading';
import { useSelector } from 'react-redux';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import { useState } from 'react';
import Container from '../components/Container';

const VerifyEmail = () => {
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

  const handleVerifyEmail = async (data) => {
    try {
      setIsLoading(true);
      if (searchParams.get('key')) {
        const token = searchParams.get('key');
        const result = await API_CALL.patch(
          '/user/user/verify-email',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (result.data.success) {
          customToast('success', result.data.message);
          navigate('/login', { replace: true });
        }
      } else {
        customToast('error', 'Invalid verify token');
      }
    } catch (error) {
      console.log(error.message);
      if (error.response.status !== 500) {
        customToast('error', error.response.data.message);
      } else {
        customToast('error', 'Failed to verify email');
      }
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div className="title mb-4">
                <span className="text-3xl font-bold">Verify Email</span>
              </div>
              <ButtonWithLoading isLoading={isLoading} func={handleVerifyEmail}>
                Verify New Email
              </ButtonWithLoading>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default VerifyEmail;
