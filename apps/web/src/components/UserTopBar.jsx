import { Avatar } from 'flowbite-react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const UserTopbar = () => {
  const location = useLocation();
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
        <span className="cursor-pointer hover:underline underline-offset-2 transition-all duration-500">
          Home
        </span>
        <span className="cursor-pointer hover:underline underline-offset-2 transition-all duration-500">
          Category
        </span>
        <span className="cursor-pointer hover:underline underline-offset-2 transition-all duration-500">
          Cart
        </span>
        <span className="cursor-pointer hover:underline underline-offset-2 transition-all duration-500">
          Orders
        </span>
        <span className="flex items-center gap-1 cursor-pointer text-blue-800 hover:underline underline-offset-2 transition-all duration-500">
          <span> {currUser.name || 'Login'}</span>
          <Avatar
            img={currUser.image ? `` : '/defaultImageSquare.jpg'}
            size={'sm'}
            rounded
          />
        </span>
      </div>
    </div>
  );
};
export default UserTopbar;
