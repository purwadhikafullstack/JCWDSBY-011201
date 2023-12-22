import { useEffect, useState } from 'react';
import { Sidebar, Button, Label, Modal, TextInput, ModalBody, ModalFooter, ModalHeader, FileInput } from 'flowbite-react'
import { HiHome, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdListBox } from "react-icons/io";
import { BsBoxFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";

const ManageCategories = () => {
    const [openModal, setOpenModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    const onCloseModal = () => {
        setOpenModal(false);
        setCategoryName('');
    };

    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-screen'>
            {/* SIDEBAR */}
            <div>
                <Sidebar collapsed={true} collapseBehavior='collapse'>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <button className='group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 dark:text-white dark:hover:bg-gray-700'>
                                <GiHamburgerMenu className='h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
                            </button>
                            <Sidebar.Item href="#" icon={HiHome} >
                                Dashboard
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={IoMdListBox} >
                                Manage Category
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={BsBoxFill} >
                                Manage Product
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </div>
            {/* END-SIDEBAR */}
            <div className='w-full p-5'>
                {/* TITLE */}
                <div className='mb-2'>
                    <p className='font-extrabold text-xl'>Manage Categories</p>
                </div>

                <div className='flex flex-wrap justify-between gap-y-5'>
                    {/* BOX ADD CATEGORY */}
                    <div className='grid place-items-center w-32 h-32 border border-black rounded'>
                        <div className='flex flex-col justify-center gap-1 w-24 h-24' >
                            <div className='grid place-items-center' >
                                <FaPlus className='text-3xl' />
                            </div>
                            <div>
                                <p className='text-sm text-center font-bold'>Add Category</p>
                            </div>
                        </div>
                    </div>
                    {/* MODAL */}
                    <Modal show={true} size='sm' dismissible>
                        <ModalHeader>Add Category</ModalHeader>
                        <ModalBody>
                            <div className='space-y-4'>
                                <div>
                                    <div className='mb-2 block'>
                                        <Label value='Category Name' />
                                    </div>
                                    <TextInput
                                        id='category-name'
                                        placeholder='Snack'
                                        value={categoryName}
                                        onChange={(event) => setCategoryName(event.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <div className='mb-2 block'>
                                        <Label value='Image' />
                                    </div>
                                    <FileInput helperText='JPG, JPEG, PNG or GIF (MAX. 1MB)'/>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className='justify-end'>
                            <Button >Add</Button>
                            <Button onClick={onCloseModal}>Close</Button>
                        </ModalFooter>
                    </Modal>
                    {/* BOX CATEGORY */}
                    <div className='flex flex-col w-32 h-32 bg-white border border-black rounded'>
                        <div className='h-[65%]'>
                            <img className='w-full h-full object-cover' src='https://picsum.photos/200' />
                        </div>
                        <div className='grid content-center flex-grow pl-1 pr-1'>
                            <p className='text-xs text-center line-clamp-2'>Sereal Sehat </p>
                        </div>
                    </div>
                    <div className='w-32 h-32 border border-red-900'></div>
                    <div className='w-32 h-32 border border-red-900'></div>
                </div>

            </div>
        </div>
    </>
};

export default ManageCategories;