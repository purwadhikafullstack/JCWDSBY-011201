import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/Footer';
import UserLayout from '../components/UserLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slice/userSlice';
import CosmoTextLogo from '../components/CosmoTextLogo';
import defaultImage from '../assets/defaultImageSquare.jpg';

const UserProfile = (props) => {
  const globalUser = useSelector((reducer) => reducer.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <UserLayout>
      <div className="flex flex-col flex-grow w-full">
        <div className="header flex flex-col pt-8 px-4 lg:px-32 pb-4 bg-blue-50 gap-2">
          <div className="flex">
            <CosmoTextLogo size={'text-4xl'} />
          </div>
          <div className="flex items-center relative">
            <span className="font-bold text-4xl lg:text-6xl w-[60%] line-clamp-2 py-2">
              Hallo, {globalUser.name}
            </span>
            <img
              className="absolute w-28 h-28 md:w-40 md:h-40 object-cover right-0 rounded-full border shadow-md bg-white"
              src={
                globalUser.image
                  ? `${import.meta.env.VITE_IMG_URL}/avatar/${globalUser.image}`
                  : defaultImage
              }
              alt="Image"
              srcSet=""
            />
          </div>
        </div>
        <div className="flex flex-grow flex-col py-8 px-4 lg:px-32 gap-4">
          <span className="font-bold text-base">Settings</span>
          <hr />
          <div className="flex flex-col gap-4">
            <span
              className="font-semibold text-lg cursor-pointer text-blue-500 hover:underline underline-offset-2"
              onClick={() => {
                navigate('/profile/detail', {
                  state: { previousPath: location.pathname },
                });
              }}
            >
              Profile Details
            </span>
            <span
              className="font-semibold text-lg cursor-pointer text-blue-500 hover:underline underline-offset-2"
              onClick={() => {
                navigate('/orders', {
                  state: { previousPath: location.pathname },
                });
              }}
            >
              Order History
            </span>
            {globalUser.type === 'regular' ? (
              <span
                className="font-semibold text-lg cursor-pointer text-blue-500 hover:underline underline-offset-2"
                onClick={() => {
                  navigate('/profile/change-email', {
                    state: { previousPath: location.pathname },
                  });
                }}
              >
                Change Email
              </span>
            ) : null}
            {globalUser.type === 'regular' ? (
              <span
                className="font-semibold text-lg cursor-pointer text-blue-500 hover:underline underline-offset-2"
                onClick={() => {
                  navigate('/profile/change-password', {
                    state: { previousPath: location.pathname },
                  });
                }}
              >
                Change Password
              </span>
            ) : null}
            <span
              className="font-semibold text-lg cursor-pointer text-blue-500 hover:underline underline-offset-2"
              onClick={() => {
                navigate('/profile/address', {
                  state: { previousPath: location.pathname },
                });
              }}
            >
              Manage Address
            </span>
            <span
              className="font-semibold text-lg cursor-pointer text-blue-500 hover:underline underline-offset-2"
              onClick={() => {
                dispatch(logout());
                localStorage.removeItem('authToken');
                navigate('/login', { replace: true });
              }}
            >
              Log Out
            </span>
          </div>
          <hr />
        </div>
        <Footer />
      </div>
    </UserLayout>
  );
};

export default UserProfile;
