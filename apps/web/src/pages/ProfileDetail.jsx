import { useSelector } from 'react-redux';
import { Avatar, Label, TextInput } from 'flowbite-react';
import Footer from '../components/Footer';
import UserLayout from '../components/UserLayout';
import { HiChevronLeft, HiOutlineChevronLeft } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ButtonWithLoading from '../components/ButtonWithLoading';

const ProfileDetail = (props) => {
  const globalUser = useSelector((reducer) => reducer.userReducer);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  return (
    <UserLayout>
      <div className="flex flex-col h-full w-full">
        <div className="header flex flex-col pt-8 px-4 pb-4 bg-blue-50 gap-2">
          <div className="flex">
            <span className="text-blue-800 font-extrabold text-3xl">Cosmo</span>
          </div>
          <div
            className="flex items-center gap-2"
            onClick={() => {
              navigate(location.state?.previousPath || '/profile');
            }}
          >
            <span className="w-8 h-8">
              <HiChevronLeft size={'100%'} />
            </span>
            <span className="font-bold text-3xl w-[60%] line-clamp-2 py-2">
              Profile Details
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center py-8 px-4 gap-4">
          <div className="w-36 h-36 rounded-full border overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={
                imageUpload
                  ? URL.createObjectURL(imageUpload)
                  : globalUser.image
                    ? `${import.meta.env.VITE_API_URL}/public/avatar/${
                        globalUser.image
                      }`
                    : '/defaultImageSquare.jpg'
              }
              alt=""
              sizes=""
              srcset=""
            />
          </div>
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="fullName" value="Full Name" />
            </div>
            <TextInput
              id="fullName"
              type="text"
              placeholder="Input your full name"
              defaultValue={globalUser.name}
              required
              helperText={<></>}
            />
          </div>
          <div className="w-full">
            <ButtonWithLoading isLoading={isLoading}>
              Save Changes
            </ButtonWithLoading>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfileDetail;
