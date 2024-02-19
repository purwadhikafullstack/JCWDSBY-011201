import {
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
} from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import NearestSTore from '../NearestStore';
import ProfileMenu from './ProfileMenu';
import CosmoTextLogo from '../CosmoTextLogo';
import cosmoLogo from '../../assets/cosmo-logo.svg';

const UserTopbarDesktop = (props) => {
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div
      className={`hidden desktop-topbar bg-white sticky lg:flex flex-col w-full top-0 z-50 shadow-lg`}
    >
      <div
        className={`navbar-line-one flex w-full gap-6 px-8 lg:px-32 py-4 items-center`}
      >
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => {
            navigate('/');
          }}
        >
          <img src={cosmoLogo} className="w-10 h-10" alt="" />
          <CosmoTextLogo size={'text-4xl'} />
        </div>

        <NearestSTore storeData={currStore} />

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

        <div className="flex items-center gap-6">
          <div
            className={`menuList flex flex-col justify-center items-center p-2 cursor-pointer`}
            onClick={() => {
              navigate('/cart', { state: { previousPath: location.pathname } });
            }}
          >
            <span className="w-6 h-6">
              <HiOutlineShoppingCart size={'100%'} />
            </span>
          </div>
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};
export default UserTopbarDesktop;
