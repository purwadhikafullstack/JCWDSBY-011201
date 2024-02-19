import { Avatar, Dropdown, Sidebar } from 'flowbite-react';
import { FaUserCheck, FaUserCog } from 'react-icons/fa';
import { TbReportMoney, TbReportAnalytics } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { customSidebar } from '../helpers/flowbiteCustomTheme';
import { IoSettingsOutline, IoPower, IoCloseSharp } from "react-icons/io5";
import { menu } from '../constants/sidebarMenu'
import logo from '../assets/cosmo-logo.svg';
import CosmoTextLogo from './CosmoTextLogo';

const MobileSidebar = ({ show, onClose }) => {
  const navigate = useNavigate();
  const globalUser = useSelector((reducer) => reducer.userReducer);
  const path = useLocation().pathname.split('/manage/')[1];

  return (
    <>
      <div className={`flex h-screen w-screen fixed top-0 z-40 border border-black ${!show && 'hidden'}`}>
        <div>
          <Sidebar theme={customSidebar}>
            <Sidebar.Items className="flex flex-col h-full">
              <div className='grid grid-flow-col'>
                <div className='flex gap-2 items-center'>
                  <img src={logo} className='w-9 h-9' />
                  <CosmoTextLogo size={'text-3xl'}/>
                </div>
                <IoCloseSharp size={28} className='self-center place-self-end' onClick={onClose} />
              </div>
              <Sidebar.ItemGroup className='flex-1'>
                {menu.map((item, index) => {
                  if (globalUser.role === 'super' && item.title === 'User') {
                    return (
                      <Sidebar.Collapse
                        icon={item.icon}
                        label={item.title}
                        key={index}
                      >
                        <Sidebar.Item
                          icon={FaUserCog}
                          onClick={() => navigate('/manage/admin')}
                          className={`cursor-pointer ${path.toLowerCase() === 'admin' ? 'bg-indigo-500 text-white font-semibold shadow-lg' : ''}`}
                        >
                          Admin Store
                        </Sidebar.Item>
                        <Sidebar.Item
                          icon={FaUserCheck}
                          onClick={() => navigate('/manage/user')}
                          className={`cursor-pointer ${path.toLowerCase() === 'user' ? 'bg-indigo-500 text-white font-semibold shadow-lg' : ''}`}
                        >
                          Registered
                        </Sidebar.Item>
                      </Sidebar.Collapse>
                    );
                  }
                  if (globalUser.role === 'admin' && item.title === 'User') {
                    return
                  }
                  if (item.title === 'Report') {
                    return (
                      <Sidebar.Collapse
                        icon={item.icon}
                        label={item.title}
                        key={index}
                      >
                        <Sidebar.Item
                          icon={TbReportAnalytics}
                          onClick={() => navigate('/manage/report/stock')}
                          className={`cursor-pointer ${path.toLowerCase() === 'report/stock' ? 'bg-indigo-500 text-white font-semibold shadow-lg' : ''}`}
                        >
                          Stock
                        </Sidebar.Item>
                        <Sidebar.Item
                          icon={TbReportMoney}
                          onClick={() => navigate('/manage/report/sales')}
                          className={`cursor-pointer ${path.toLowerCase() === 'report/sales' ? 'bg-indigo-500 text-white font-semibold shadow-lg' : ''}`}
                        >
                          Sales
                        </Sidebar.Item>
                      </Sidebar.Collapse>
                    );
                  }

                  return (
                    <Sidebar.Item
                      onClick={() => navigate(item.page)}
                      icon={() => <item.icon />}
                      key={index}
                      className={`cursor-pointer ${path.toLowerCase() === item.title.toLowerCase() ? 'bg-indigo-500 text-white font-semibold shadow-lg' : ''}`}
                    >
                      {item.title}
                    </Sidebar.Item>
                  );
                })}
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup className="grid mb-5">
                <div className='flex'>
                  <Avatar rounded />
                  <div className='flex-1 grid self-center'>
                    <span className='font-bold truncate'>{globalUser.name || ''}</span>
                    <span className='truncate'>{globalUser.email || ''}</span>
                  </div>
                  <div className='grid self-center'>
                    <Dropdown
                      renderTrigger={() => (
                        <span className="hover:cursor-pointer">
                          <IoSettingsOutline className="w-6 h-6" />
                        </span>
                      )}
                    >
                      <Dropdown.Item icon={IoPower} onClick={() => { localStorage.removeItem('authToken'); navigate('/') }}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
        <div className='bg-black opacity-50 w-full h-full cursor-pointer' onClick={onClose} />
      </div>
    </>
  );
};

export default MobileSidebar;
