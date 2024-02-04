import { HiHome, HiDocumentReport } from 'react-icons/hi';
import { MdInventory, MdStore } from 'react-icons/md';
import { IoMdListBox } from 'react-icons/io';
import { BsBoxFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { TbDiscount2 } from "react-icons/tb";

export const menu = [
  {
    title: 'Dashboard',
    icon: HiHome,
    page: '/manage/dashboard',
  },
  {
    title: 'Category',
    icon: IoMdListBox,
    page: '/manage/category',
  },
  {
    title: 'Product',
    icon: BsBoxFill,
    page: '/manage/product',
  },
  {
    title: 'Inventory',
    icon: MdInventory,
    page: '/manage/inventory',
  },
  {
    title: 'User',
    icon: FaUser,
  },
  {
    title: 'Store',
    icon: MdStore,
    page: '/manage/store',
  },
  {
    title: 'Discount',
    icon: TbDiscount2,
    page: '/manage/discount',
  },
  {
    title: 'Report',
    icon: HiDocumentReport,
  },
];