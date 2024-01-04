import { Avatar } from 'flowbite-react';
import {
  HiOutlineBuildingStorefront,
  HiOutlineMagnifyingGlass,
  HiOutlineReceiptPercent,
  HiOutlineShoppingCart,
  HiOutlineSquaresPlus,
} from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const UserTopbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currUser = useSelector((reducer) => reducer.userReducer);
  return (
    <div
      className={`${
        location.pathname.includes('profile') ? 'hidden' : 'flex'
      } lg:flex sticky top-0 w-full bg-blue-50 items-center gap-2 lg:gap-6 py-2 px-4 z-50`}
    >
      <div className="flex cursor-pointer">
        <span className="text-blue-800 font-extrabold text-2xl">Cosmo</span>
      </div>

      <div className="search flex flex-grow items-center border-2 py-2 px-4 rounded-full gap-2">
        <input
          type="search"
          placeholder="Search for products"
          className=" flex-grow outline-none bg-transparent text-sm font-semibold"
        />
        <span className="w-6 h-6">
          <HiOutlineMagnifyingGlass size={'100%'} />
        </span>
      </div>
      <div className="hidden lg:flex items-center gap-6 text-base font-semibold">
        <div
          className={`menuList flex flex-col justify-center items-center p-2 cursor-pointer ${
            location.pathname === '/' ? 'text-blue-700' : ''
          }`}
          onClick={() => {
            navigate('/', { state: { previousPath: location.pathname } });
          }}
        >
          <span className="w-6 h-6">
            <HiOutlineBuildingStorefront size={'100%'} />
          </span>
          <span className="text-xs font-semibold">Home</span>
        </div>
        <div
          className={`menuList flex flex-col justify-center items-center p-2 cursor-pointer ${
            location.pathname.includes('category') ? 'text-blue-700' : ''
          }`}
          onClick={() => {
            navigate('/category', {
              state: { previousPath: location.pathname },
            });
          }}
        >
          <span className="w-6 h-6">
            <HiOutlineSquaresPlus size={'100%'} />
          </span>
          <span className="text-xs font-semibold">Category</span>
        </div>
        <div
          className={`menuList flex flex-col justify-center items-center p-2 cursor-pointer ${
            location.pathname.includes('cart') ? 'text-blue-700' : ''
          }`}
          onClick={() => {
            navigate('/cart', { state: { previousPath: location.pathname } });
          }}
        >
          <span className="w-6 h-6">
            <HiOutlineShoppingCart size={'100%'} />
          </span>
          <span className="text-xs font-semibold">Cart</span>
        </div>
        <div
          className={`menuList flex flex-col justify-center items-center p-2 cursor-pointer ${
            location.pathname.includes('orders') ? 'text-blue-700' : ''
          }`}
          onClick={() => {
            navigate('/orders', { state: { previousPath: location.pathname } });
          }}
        >
          <span className="w-6 h-6">
            <HiOutlineReceiptPercent size={'100%'} />
          </span>
          <span className="text-xs font-semibold">Orders</span>
        </div>
        <span
          className="flex items-center gap-1 cursor-pointer text-blue-800 hover:underline underline-offset-2 transition-all duration-500"
          onClick={() => {
            if (currUser.name) {
              navigate('/profile', {
                state: { previousPath: location.pathname },
              });
            } else {
              navigate('/login', {
                state: { previousPath: location.pathname },
              });
            }
          }}
        >
          <span> {currUser.name || 'Login'}</span>
          <Avatar
            img={
              currUser.image
                ? `${import.meta.env.VITE_IMG_URL}/avatar/${currUser.image}`
                : '/defaultImageSquare.jpg'
            }
            size={'sm'}
            rounded
          />
        </span>
      </div>
    </div>
  );
};
export default UserTopbar;