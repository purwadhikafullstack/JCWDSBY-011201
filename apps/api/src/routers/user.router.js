import { Router } from 'express';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import uploader from '../helper/uploader';
import getAllUser from './admin/getAllUser';
import { specialTokenValidation } from '../middleware/specialTokenValidation';
import {
  changeEmailController,
  changePasswordController,
  updateUserUserController,
  verifyEmailController,
} from '../controllers/user.controller';

const userRouter = Router();

userRouter.patch(
  '/user',
  validateToken,
  validateUser,
  uploader('/avatar', 1).single('avatarUpload'),
  updateUserUserController,
);
userRouter.patch(
  '/user/change-password',
  validateToken,
  validateUser,
  changePasswordController,
);
userRouter.patch(
  '/user/change-email',
  validateToken,
  validateUser,
  changeEmailController,
);
userRouter.patch(
  '/user/verify-email',
  specialTokenValidation,
  verifyEmailController,
);
userRouter.get('/', getAllUser);

export { userRouter };
