import { Router } from 'express';
import {
  validateSuper,
  validateToken,
  validateUser,
} from '../middleware/tokenValidation';
import uploader from '../helper/uploader';
// import getAllUser from './admin/getAllUser';
import { specialTokenValidation } from '../middleware/specialTokenValidation';
import {
  changeEmailController,
  changePasswordController,
  updateUserUserController,
  verifyEmailController,
} from '../controllers/user.controller';
import { body } from 'express-validator';
import getUser from '../controllers/admin.controller';

const userRouter = Router();

userRouter.patch(
  '/user',
  validateToken,
  validateUser,
  uploader('/avatar', 1).single('avatarUpload'),
  body('name').notEmpty().isString().escape(),
  updateUserUserController,
);
userRouter.patch(
  '/user/change-password',
  validateToken,
  validateUser,
  body('currPassword')
    .notEmpty()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/),
  body('newPassword')
    .notEmpty()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/),
  changePasswordController,
);
userRouter.patch(
  '/user/change-email',
  validateToken,
  validateUser,
  body('newEmail').notEmpty().isEmail(),
  changeEmailController,
);
userRouter.patch(
  '/user/verify-email',
  specialTokenValidation,
  verifyEmailController,
);
userRouter.get('/', validateToken, validateSuper, getUser);

export { userRouter };
