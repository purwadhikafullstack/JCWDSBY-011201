import { HiChevronLeft } from 'react-icons/hi2';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import cosmoLogo from '../../assets/cosmo-logo.svg';

const UserTopbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currUser = useSelector((reducer) => reducer.userReducer);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div
      className={`${
        location.pathname.includes('profile') ? 'hidden' : 'flex'
      } lg:hidden sticky top-0 w-full bg-white shadow-md items-center gap-2 lg:gap-6 py-2 px-4 z-50`}
    >
      <div
        className="hidden md:flex cursor-pointer"
        onClick={() => {
          navigate('/');
        }}
      >
        <span className="text-blue-800 font-extrabold text-2xl">Cosmo</span>
      </div>
      <div
        className={`flex md:hidden cursor-pointer ${
          location.pathname.includes('category') ||
          location.pathname.includes('product') ||
          location.pathname.includes('cart')||
          location.pathname.includes('checkout')
            ? 'hidden'
            : ''
        }`}
        onClick={() => {
          navigate('/');
        }}
      >
        <img className="w-8 h-8" src={cosmoLogo} alt="" srcSet="" />
      </div>

      <div
        className={`${
          location.pathname.includes('category') ||
          location.pathname.includes('product') ||
          location.pathname.includes('cart')||
          location.pathname.includes('checkout')
            ? 'flex'
            : 'hidden'
        } md:hidden items-center cursor-pointer`}
        onClick={() => {
          navigate(location.state?.previousPath || '/');
        }}
      >
        <span className="w-8 h-8">
          <HiChevronLeft size={'100%'} />
        </span>
      </div>

      <div
        className="search flex flex-grow items-center bg-gray-100 py-2 px-4 rounded-lg gap-2"
        onClick={() => {
          if (!location.pathname.includes('category')) navigate('/category');
        }}
      >
        <input
          type="search"
          placeholder="What are you looking for?"
          className=" flex-grow outline-none bg-transparent text-sm font-semibold"
          defaultValue={searchParams.get('q')}
          onChange={(e) => {
            setTimeout(() => {
              setSearchParams((value) => {
                if (!e.target.value) {
                  value.delete('q');
                } else {
                  value.set('q', e.target.value);
                }
                return value;
              });
            }, 1000);
          }}
        />
        <span className="w-4 h-4">
          <HiOutlineMagnifyingGlass size={'100%'} />
        </span>
      </div>
    </div>
  );
};
export default UserTopbar;
