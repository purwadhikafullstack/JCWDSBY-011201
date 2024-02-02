import { Avatar, Dropdown, Sidebar } from 'flowbite-react';
// import { GiHamburgerMenu } from 'react-icons/gi';

import { FaUserCheck, FaUserCog } from 'react-icons/fa';
import { TbReportMoney, TbReportAnalytics } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { customSidebar } from '../helpers/flowbiteCustomTheme';
import { IoSettingsOutline, IoPower } from "react-icons/io5";
import logo from '../assets/cosmo-logo.svg';
import { menu } from '../constants/sidebarMenu'

const AdminSidebar = () => {
  const navigate = useNavigate();
  const globalUser = useSelector((reducer) => reducer.userReducer);
  const path = useLocation().pathname.split('/manage/')[1];

  return (
    <>
      <div className="h-screen hidden lg:block lg:sticky top-0 z-40">
        <Sidebar theme={customSidebar}>
          <Sidebar.Items className="flex flex-col h-full">
            <div className='grid justify-center'>
              <div className='flex gap-2 items-center'>
                <img src={logo} className='w-11 h-11' />
                <p className='self-center text-5xl font-extrabold font-roboto bg-clip-text bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-transparent'>cosmo</p>
              </div>
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

                return <Sidebar.Item
                    onClick={() => navigate(item.page)}
                    icon={() => <item.icon />}
                    key={index}
                    className={`cursor-pointer ${path.toLowerCase() === item.title.toLowerCase() ? 'bg-indigo-500 text-white font-semibold shadow-lg' : ''}`}
                  >
                    {item.title}
                  </Sidebar.Item>;
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
                        // placement="left-start"
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
    </>
  );
};

export default AdminSidebar;
