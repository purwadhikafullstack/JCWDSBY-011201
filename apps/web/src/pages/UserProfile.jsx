import { useSelector } from 'react-redux';
import Container from '../components/Container';
import UserBottomBar from '../components/UserBottomBar';
import { Avatar } from 'flowbite-react';
import Footer from '../components/Footer';
import UserLayout from '../components/UserLayout';

const UserProfile = (props) => {
  const globalUser = useSelector((reducer) => reducer.userReducer);
  return (
    <UserLayout>
      <div className="flex flex-col h-full w-full">
        <div className="header flex flex-col pt-8 px-4 pb-4 bg-blue-50 gap-2">
          <div className="flex">
            <span className="text-blue-800 font-extrabold text-3xl">Cosmo</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-4xl w-[60%] line-clamp-2">
              Hallo,{globalUser.name}
            </span>
            <div className="flex w-[40%] justify-end lg:justify-center items-center">
              <Avatar
                img={
                  globalUser.image
                    ? `${import.meta.env.VITE_API_URL}/avatar/${
                        globalUser.image
                      }`
                    : '/defaultImageSquare.jpg'
                }
                size={'lg'}
                rounded
              />
            </div>
          </div>
        </div>
        <div className="flex flex-grow flex-col py-8 px-4 gap-4">
          <span className="font-bold text-base">Settings</span>
          <div className="flex flex-col gap-4">
            <span className="font-semibold text-lg">Profile Details</span>
            {globalUser.type === 'regular' ? (
              <span className="font-semibold text-lg">Change Password</span>
            ) : null}
            <span className="font-semibold text-lg">Manage Address</span>
            <span className="font-semibold text-lg">Log Out</span>
          </div>
        </div>
        <Footer />
      </div>
    </UserLayout>
  );
};

export default UserProfile;
