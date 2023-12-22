import { GoogleLogin, useGoogleLogout } from '@leecheuk/react-google-login';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import { useNavigate } from 'react-router-dom';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const logOut = useGoogleLogout({ clientId: clientId });

  const onSuccess = async (res) => {
    try {
      const result = await API_CALL.post('/auth/login/google', {
        email: res.profileObj.email,
        password: `${res.profileObj.googleId}${res.profileObj.givenName}`,
      });
      if (result.data.success) {
        customToast('success', result.data.message);
        localStorage.setItem('authToken', result.data.result.token);
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
      customToast('error', error.response.data.message);
    }
    logOut.signOut();
  };

  const onFailure = (res) => {
    console.log('Login Failed :', res);
  };

  return (
    <div id="signInButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
};

export default LoginWithGoogle;
