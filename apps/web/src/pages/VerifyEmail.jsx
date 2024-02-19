import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import cosmoLogo from '../assets/cosmo-logo.svg';
import ButtonWithLoading from '../components/ButtonWithLoading';
import { useSelector } from 'react-redux';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import { useState } from 'react';
import Container from '../components/Container';
import CosmoTextLogo from '../components/CosmoTextLogo';

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
          <div className="flex w-full h-full justify-center items-center py-6">
            <div className="flex flex-col w-full md:w-[500px] p-6 lg:p-8 border rounded-lg overflow-hidden shadow-lg">
              <div className="flex items-center justify-center gap-2 py-3 drop-shadow-md">
                <img className="w-16 h-16" src={cosmoLogo} alt="" />
                <CosmoTextLogo size={'text-6xl'} />
              </div>
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
