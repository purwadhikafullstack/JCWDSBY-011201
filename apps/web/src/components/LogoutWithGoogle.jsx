import { GoogleLogout } from '@leecheuk/react-google-login';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LogoutWithGoogle = () => {
  const onSuccess = () => {
    console.log('Logout Success');
  };

  return (
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
};

export default LogoutWithGoogle;
