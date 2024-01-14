import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Label, TextInput } from 'flowbite-react';
import UserLayout from '../components/UserLayout';
import {
  HiChevronLeft,
  HiOutlineChevronLeft,
  HiOutlinePencilSquare,
} from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ButtonWithLoading from '../components/ButtonWithLoading';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import { login } from '../redux/slice/userSlice';
import { MAX_SIZE } from '../constants/file';

const UserProfileDetail = (props) => {
  const dispatch = useDispatch();
  const globalUser = useSelector((reducer) => reducer.userReducer);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUpload, setAvatarUpload] = useState(null);

  console.log(globalUser);

  const profileDetailSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Z]([a-zA-Z]|\.| |-|')+$/, 'Invalid name format')
      .required('Required'),
  });

  const handleEditProfile = async (data) => {
    try {
      if (avatarUpload?.size > MAX_SIZE)
        throw { detail: 'Avatar size is too big' };
      setIsLoading(true);
      const formData = new FormData();
      formData.append('avatarUpload', avatarUpload);
      formData.append('name', data.name);
      const result = await API_CALL.patch('/user/user', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (result.data.success) {
        setIsLoading(false);
        setAvatarUpload(null);
        customToast('success', 'Success edit profile');
        console.log(result.data.result);
        dispatch(login(result.data.result));
      }
    } catch (error) {
      console.log(error);
      customToast(
        'error',
        `Fail to edit profile ${error.detail ? error.detail : ''}`,
      );
      setIsLoading(false);
    }
  };

  const handleFile = (e) => {
    setAvatarUpload(e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      name: globalUser.name,
    },
    validationSchema: profileDetailSchema,
    onSubmit: (values) => {
      handleEditProfile(values);
    },
  });

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
            <span className="font-bold text-3xl line-clamp-2 py-2">
              Profile Details
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center py-8 px-4 gap-4">
          <div className="w-36 h-36 rounded-full border overflow-hidden relative">
            <img
              className="w-full h-full object-cover"
              src={
                avatarUpload
                  ? URL.createObjectURL(avatarUpload)
                  : globalUser.image
                    ? `${import.meta.env.VITE_IMG_URL}/avatar/${
                        globalUser.image
                      }`
                    : '/defaultImageSquare.jpg'
              }
            />
            <label
              className="absolute w-8 h-8 p-1 text-center text-white bg-blue-400 text-xs font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg backdrop-blur-sm"
              htmlFor="avatarUpload"
            >
              <HiOutlinePencilSquare size={'100%'} />
            </label>
            <input
              className="hidden"
              type="file"
              id="avatarUpload"
              name="avatarUpload"
              onChange={handleFile}
              accept=".jpg,.png,.jpeg,.gif"
            />
          </div>
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="name" value="Full Name" />
            </div>
            <TextInput
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Input your full name"
              required
              helperText={
                <>
                  <span
                    className={`${
                      formik.touched.name && formik.errors.name
                        ? ''
                        : 'invisible'
                    } text-xs text-red-500`}
                  >
                    {formik.errors.name || 'Correct'}
                  </span>
                </>
              }
            />
          </div>
          <div className="w-full">
            <ButtonWithLoading isLoading={isLoading} func={formik.handleSubmit}>
              Save Changes
            </ButtonWithLoading>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfileDetail;
