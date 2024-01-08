import { Avatar, Sidebar } from 'flowbite-react'
import { HiHome } from 'react-icons/hi';
import { MdInventory, MdStore } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdListBox } from "react-icons/io";
import { BsBoxFill } from "react-icons/bs";
import { FaUser, FaUserCheck, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const globalUser = useSelector((reducer) => reducer.userReducer);

    const menu = [
        {
            title: 'Dashboard',
            icon: HiHome,
            page: '/manage/dashboard'
        },
        {
            title: 'Category',
            icon: IoMdListBox,
            page: '/manage/category'
        },
        {
            title: 'Product',
            icon: BsBoxFill,
            page: '/manage/product'
        },
        {
            title: 'Inventory',
            icon: MdInventory,
            page: '/manage/inventory'
        },
        {
            title: 'User',
            icon: FaUser,
            // page: '/manage/inventory'
        },
        {
            title: 'Store',
            icon: MdStore,
            page: '/manage/store'
        },
    ]

    return <>
        <div className='h-screen sticky top-0 z-10'>
            <Sidebar collapsed={true}>
                <Sidebar.Items className='grid content-between h-full'>
                    <Sidebar.ItemGroup>
                        <button className='group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 dark:text-white dark:hover:bg-gray-700'>
                            <GiHamburgerMenu className='h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
                        </button>
                        {menu.map((item, index) => {
                            // console.log('USER ROLE', globalUser.role);
                            if (globalUser.role === 'super' && item.title === 'User') {
                                return <Sidebar.Collapse icon={FaUser} label={item.title} key={index}>
                                    <Sidebar.Item icon={FaUserCog} onClick={() => navigate('/manage/admin')}>Admin Store</Sidebar.Item>
                                    <Sidebar.Item icon={FaUserCheck} onClick={() => navigate('/manage/user')}>Registered</Sidebar.Item>
                                </Sidebar.Collapse>
                            }
                            return <Sidebar.Item onClick={() => navigate(item.page)} icon={item.icon} key={index}>
                                {item.title}
                            </Sidebar.Item>
                        })}
                        {/* <Sidebar.Collapse icon={FaUser} label='tes'>
                            <Sidebar.Item>user</Sidebar.Item>
                            <Sidebar.Item>admin store</Sidebar.Item>
                        </Sidebar.Collapse> */}
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup className='mb-5'>
                        <Avatar rounded />
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup className='mb-5'>
                        <Avatar rounded />
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    </>
}

export default AdminSidebar;