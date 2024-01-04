import { Sidebar } from 'flowbite-react'
import { HiHome } from 'react-icons/hi';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdListBox } from "react-icons/io";
import { BsBoxFill } from "react-icons/bs";

const AdminSidebar = () => {
    const menu = [
        {
            title: 'Dashboard',
            icon: HiHome,
        },
        {
            title: 'Manage Category',
            icon: IoMdListBox,
        },
        {
            title: 'Manage Product',
            icon: BsBoxFill,
        },
    ]

    return <>
        <div className='h-screen sticky top-0'>
            <Sidebar collapsed={true}>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <button className='group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 dark:text-white dark:hover:bg-gray-700'>
                            <GiHamburgerMenu className='h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
                        </button>
                        {menu.map((item, index) => {
                            return (
                                <Sidebar.Item href="#" icon={item.icon} key={index}>
                                    {item.title}
                                </Sidebar.Item>
                            )
                        })}
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    </>
}

export default AdminSidebar;