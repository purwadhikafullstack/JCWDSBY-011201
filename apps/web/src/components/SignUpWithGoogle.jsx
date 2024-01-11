import { GoogleLogin, useGoogleLogout } from '@leecheuk/react-google-login';
import { useNavigate } from 'react-router-dom';
import customToast from '../utils/toast';
import API_CALL from '../helpers/API';
import { replace } from 'formik';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slice/userSlice';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SignUpWithGoogle = () => {
  const navigate = useNavigate();
  const logOut = useGoogleLogout({ clientId: clientId });
  const dispatch = useDispatch();

  const onSuccess = async (res) => {
    try {
      const result = await API_CALL.post('/auth/signup/google', {
        name: `${res.profileObj.givenName} ${
          res.profileObj.familyName ? res.profileObj.familyName : ''
        }`,
        email: res.profileObj.email,
        password: `${res.profileObj.googleId}${res.profileObj.givenName}`,
      });
      if (result.data.success) {
        customToast('success', result.data.message);
        console.log(result.data.result);
        dispatch(login(result.data.result));
        localStorage.setItem('authToken', result.data.result.token);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
    logOut.signOut();
  };

  const onFailure = (res) => {
    customToast('error', 'SignUp with google failed');
  };

  return (
    <div id="signUpButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="SignUp with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
};

export default SignUpWithGoogle;
