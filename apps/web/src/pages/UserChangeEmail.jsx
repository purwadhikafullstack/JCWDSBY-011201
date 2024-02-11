import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Label, Modal, TextInput } from 'flowbite-react';
import UserLayout from '../components/UserLayout';
import { HiChevronLeft, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ButtonWithLoading from '../components/ButtonWithLoading';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import { logout } from '../redux/slice/userSlice';
import InputPassword from '../components/InputPassword';
import CosmoTextLogo from '../components/CosmoTextLogo';

const UserChangeEmail = (props) => {
  const globalUser = useSelector((reducer) => reducer.userReducer);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const changeEmailSchema = Yup.object({
    newEmail: Yup.string()
      .email('Invalid email address')
      .required('Required')
      .notOneOf(
        [globalUser.email],
        'New email must been different from the old ones',
      ),
  });

  const handleChangeEmail = async (data) => {
    try {
      setIsLoading(true);
      const result = await API_CALL.patch('/user/user/change-email', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (result.data.success) {
        customToast('success', 'Verify link is sent to your new email');
        localStorage.removeItem('authToken');
        dispatch(logout());
        navigate('/login', { replace: true });
      }
    } catch (error) {
      customToast(
        'error',
        error.response.data.message || 'Failed to change email',
      );
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      newEmail: globalUser.email,
    },
    validationSchema: changeEmailSchema,
    onSubmit: (values) => {
      handleChangeEmail(values);
    },
  });

  return (
    <UserLayout>
      <div className="flex flex-col h-full w-full">
        <div className="header flex flex-col pt-8 px-4 lg:px-32 pb-4 bg-blue-50 gap-2">
          <div className="flex">
            <CosmoTextLogo size={'text-4xl'} />
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
              Change Email
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center py-8 px-4 lg:px-32 gap-4">
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="newEmail" value="Email" />
            </div>
            <TextInput
              type={'email'}
              id={'newEmail'}
              name={'newEmail'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newEmail}
              placeholder="Input your new email"
              helperText={
                <span
                  className={`${
                    formik.touched.newEmail && formik.errors.newEmail
                      ? ''
                      : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.newEmail || 'Correct'}
                </span>
              }
            />
          </div>
          <div className="w-full">
            <ButtonWithLoading
              isLoading={isLoading}
              func={() => {
                setOpenModal(true);
              }}
            >
              Save Changes
            </ButtonWithLoading>
          </div>
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want change your email?. After changing your
                  email you will be logged out, and you need to verify your
                  email again.
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    className="w-full"
                    isProcessing={isLoading}
                    color="blue"
                    onClick={(e) => {
                      formik.handleSubmit(e);
                      setOpenModal(false);
                    }}
                  >
                    {"Yes, I'm sure"}
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserChangeEmail;
