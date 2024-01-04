import { Router } from 'express';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import uploader from '../helper/uploader';
import updateUserUser from './user/updateUserUser';
import changePassword from './user/changePasswordUser';

const userRouter = Router();

// For user use ('/user')
userRouter.patch(
  '/user',
  validateToken,
  validateUser,
  uploader('/avatar', 1).single('avatarUpload'),
  updateUserUser,
);
userRouter.patch(
  '/user/change-password',
  validateToken,
  validateUser,
  changePassword,
);

// For admin use ('/admin')
// For super use ('/super')

export { userRouter };
