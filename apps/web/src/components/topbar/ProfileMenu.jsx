import { Avatar, Button } from 'flowbite-react';
import { useState } from 'react';
import { HiBanknotes, HiChevronDown, HiPower, HiUser } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slice/userSlice';
import defaultImage from '../../assets/defaultImageSquare.jpg';

const ProfileMenu = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currUser = useSelector((reducer) => reducer.userReducer);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useDispatch();
  return (
    <>
      {currUser.name ? (
        <span
          className="flex relative items-center gap-2 cursor-pointer text-gray-500 font-bold text-sm hover:underline underline-offset-2 transition-all duration-500"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          <img
            className="w-9 h-9 object-cover rounded-full border"
            src={
              currUser.image
                ? `${import.meta.env.VITE_IMG_URL}/avatar/${currUser.image}`
                : defaultImage
            }
            alt=""
          />
          <span>{currUser.name}</span>
          <HiChevronDown className="w-4 h-4" />
          <div
            className={`${
              showProfileMenu ? 'flex' : 'hidden'
            } absolute top-8 right-0 flex-col bg-white shadow-sm p-4 gap-2 rounded-lg justify-center`}
          >
            <div
              className="flex gap-2 items-center font-normal hover:underline underline-offset-1"
              onClick={() => {
                navigate('/profile', {
                  state: { previousPath: location.pathname },
                });
              }}
            >
              <HiUser className="w-4 h-4" />
              <span>Profile</span>
            </div>
            <div
              className="flex gap-2 items-center font-normal hover:underline underline-offset-1"
              onClick={() => {
                navigate('/orders');
              }}
            >
              <HiBanknotes className="w-4 h-4" />
              <span>Orders</span>
            </div>
            <div
              className="flex gap-2 items-center font-normal hover:underline underline-offset-1"
              onClick={() => {
                dispatch(logout());
                localStorage.removeItem('authToken');
                navigate('/login', { replace: true });
              }}
            >
              <HiPower className="w-4 h-4" />
              <span>Log Out</span>
            </div>
          </div>
        </span>
      ) : (
        <div className="flex gap-2">
          <Button
            color="blue"
            size={'sm'}
            onClick={() => {
              navigate('/login', {
                state: { previousPath: location.pathname },
              });
            }}
          >
            Login
          </Button>
          <Button
            color="light"
            size={'sm'}
            onClick={() => {
              navigate('/signup', {
                state: { previousPath: location.pathname },
              });
            }}
          >
            Sign Up
          </Button>
        </div>
      )}
    </>
  );
};
export default ProfileMenu;
