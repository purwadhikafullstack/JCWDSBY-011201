import { Router } from 'express';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import uploader from '../helper/uploader';
import updateUserUser from './user/updateUserUser';
import changePassword from './user/changePasswordUser';
import { getAllUser } from '../controllers/admin.controller';

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
userRouter.get('/', async (req, res, next) => {
  try {
    const result = await getAllUser();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// For admin use ('/admin')
// For super use ('/super')

export { userRouter };
