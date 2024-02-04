import logo from '../../assets/cosmo-logo.svg';
import { GiHamburgerMenu } from 'react-icons/gi';
import CosmoTextLogo from '../CosmoTextLogo';

const DashboardHeader = ({onClick}) => {
  return <>
    <div className="bg-white flex py-2 fixed border shadow-xl w-screen lg:hidden z-10">
      <button className="absolute group flex items-center p-2 ml-2" onClick={onClick}>
        <GiHamburgerMenu className="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
      </button>
      <div className='flex flex-1 justify-center '>
        <div className='flex gap-2 items-center'>
          <img src={logo} className='w-9 h-9' />
          <CosmoTextLogo size={'text-3xl'}/>
        </div>
      </div>
    </div>
  </>
};

export default DashboardHeader;