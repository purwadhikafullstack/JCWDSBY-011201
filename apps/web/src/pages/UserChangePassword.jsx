import { Button, Label, Modal } from 'flowbite-react';
import UserLayout from '../components/UserLayout';
import { HiChevronLeft, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ButtonWithLoading from '../components/ButtonWithLoading';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';
import InputPassword from '../components/InputPassword';
import CosmoTextLogo from '../components/CosmoTextLogo';

const UserChangePassword = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const changePasswordSchema = Yup.object({
    currPassword: Yup.string()
      .min(8, 'Minimum password length is 8')
      .required('Required'),
    newPassword: Yup.string()
      .min(8, 'Minimum password length is 8')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain uppercase letter, lowercase letter, number, and no space',
      )
      .notOneOf(
        [Yup.ref('currPassword')],
        'New password must different from current password',
      )
      .required('Required'),
  });

  const handleChangePassword = async (data) => {
    try {
      setIsLoading(true);
      const result = await API_CALL.patch('/user/user/change-password', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (result.data.success) {
        customToast('success', 'Password has been changed');
        formik.handleReset();
      }
    } catch (error) {
      customToast('error', error.response.data.message);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      currPassword: '',
      newPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: (values) => {
      handleChangePassword(values);
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
              Change Password
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center py-8 px-4 lg:px-32 gap-4">
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="currPassword" value="Current Password" />
            </div>
            <InputPassword
              id={'currPassword'}
              name={'currPassword'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currPassword}
              placeholder="Input your current password"
              HelperText={
                <span
                  className={`${
                    formik.touched.currPassword && formik.errors.currPassword
                      ? ''
                      : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.currPassword || 'Correct'}
                </span>
              }
            />
          </div>
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="newPassword" value="New Password" />
            </div>
            <InputPassword
              id={'newPassword'}
              name={'newPassword'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              placeholder="Input your new password"
              HelperText={
                <span
                  className={`${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? ''
                      : 'invisible'
                  } text-xs text-red-500`}
                >
                  {formik.errors.newPassword || 'Correct'}
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
                  Are you sure you want change your password?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    className="w-full"
                    isProcessing={isLoading}
                    color="blue"
                    onClick={(e) => {
                      setOpenModal(false);
                      formik.handleSubmit(e);
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

export default UserChangePassword;
