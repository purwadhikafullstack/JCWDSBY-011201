import { Button, FloatingLabel, TextInput } from 'flowbite-react';
import { BsMailbox } from 'react-icons/bs';
import {
  FaFacebook,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';
import CosmoTextLogo from './CosmoTextLogo';

const Footer = (props) => {
  return (
    <footer className="flex flex-col w-full px-4 lg:px-32 py-6 gap-3">
      <div className="grid bg-blue-50 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-4 p-4 lg:p-12 rounded-xl">
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <CosmoTextLogo size={'text-4xl'} />
          </div>
          {/* <span className="text-blue-800 font-extrabold text-4xl drop-shadow-md">
            Cosmo
          </span> */}
          <span className="text-gray-600">
            Jl. Gubeng Kertajaya XI-A No-7, Gubeng, Surabaya
          </span>
          <div className="flex gap-2 mt-2">
            <span className="p-2 rounded-full bg-white shadow-md">
              <FaFacebookF className="w-8 h-8 text-blue-700" />
            </span>
            <span className="p-2 rounded-full bg-white shadow-md">
              <FaInstagram className="w-8 h-8 text-blue-700" />
            </span>
            <span className="p-2 rounded-full bg-white shadow-md">
              <FaTwitter className="w-8 h-8 text-blue-700" />
            </span>
            <span className="p-2 rounded-full bg-white shadow-md">
              <FaYoutube className="w-8 h-8 text-blue-700 shadow-md" />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-blue-800 font-bold text-2xl">Useful Links</span>

          <div className="flex flex-col gap-2">
            <span className="font-semibold text-gray-500">Blog</span>
            <span className="font-semibold text-gray-500">Discounts</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-blue-800 font-bold text-2xl">Help & Guide</span>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-gray-500">Payments</span>
            <span className="font-semibold text-gray-500">Term of Service</span>
            <span className="font-semibold text-gray-500">Return Policy</span>
            <span className="font-semibold text-gray-500">FAQ</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-blue-800 font-bold text-2xl">Newsletter</span>
          <div className="flex flex-col gap-3">
            <span className="text-sm text-gray-500">
              Join our newsletter to get info about events, discounts, and many
              more.
            </span>
            <div className="flex gap-1">
              <TextInput
                type="email"
                icon={BsMailbox}
                placeholder="Your email"
              />
              <Button color="blue">
                <HiArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <hr />
            <div className="flex flex-col gap-1 text-gray-500">
              <span>T : 123-456-789</span>
              <span>E : cosmogrocery@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <span>@ {new Date().getFullYear()} Cosmo Grocery</span>
      </div>
    </footer>
  );
};

export default Footer;
