import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'flowbite-react';
import Footer from '../components/Footer';
import UserLayout from '../components/UserLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slice/userSlice';

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
            <span className="text-blue-800 font-extrabold text-3xl">Cosmo</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-4xl w-[60%] line-clamp-2 py-2">
              Hallo, {globalUser.name}
            </span>
            <div className="flex w-[40%] justify-end lg:justify-center items-center">
              <Avatar
                className="flex md:hidden object-cover"
                img={
                  globalUser.image
                    ? `${import.meta.env.VITE_IMG_URL}/avatar/${
                        globalUser.image
                      }`
                    : '/defaultImageSquare.jpg'
                }
                size={'lg'}
                rounded
              />
              <Avatar
                className="hidden md:flex object-cover"
                img={
                  globalUser.image
                    ? `${import.meta.env.VITE_IMG_URL}/avatar/${
                        globalUser.image
                      }`
                    : '/defaultImageSquare.jpg'
                }
                size={'xl'}
                rounded
              />
            </div>
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
