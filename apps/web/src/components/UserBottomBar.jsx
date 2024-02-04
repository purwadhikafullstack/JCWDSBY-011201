import {
  HiOutlineBuildingStorefront,
  HiOutlineSquaresPlus,
  HiOutlineShoppingCart,
  HiOutlineReceiptPercent,
  HiOutlineUser,
} from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const UserBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartLength = useSelector((state) => state.cartReducer.items.length);
  return (
    <div className="UserBottomBar flex lg:hidden sticky bottom-0 w-full rounded-t-xl justify-evenly border bg-white shadow-md p-2">
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
          navigate('/category', { state: { previousPath: location.pathname } });
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
          <HiOutlineShoppingCart size={'100%'}></HiOutlineShoppingCart>
          {cartLength && cartLength > 0 ? (
            <div className="absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full top-2 right-[155px] min-[380px]:right-[165px]">
              {cartLength}
            </div>
          ) : null}
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
      <div
        className={`menuList flex flex-col justify-center items-center p-2 cursor-pointer ${
          location.pathname.includes('profile') ? 'text-blue-700' : ''
        }`}
        onClick={() => {
          navigate('/profile', { state: { previousPath: location.pathname } });
        }}
      >
        <span className="w-6 h-6">
          <HiOutlineUser size={'100%'} />
        </span>
        <span className="text-xs font-semibold">Profile</span>
      </div>
    </div>
  );
};

export default UserBottomBar;
