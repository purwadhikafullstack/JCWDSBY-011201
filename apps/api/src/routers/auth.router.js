import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation';
import googleSignUp from './auth/socialSignUp';
import googleLogin from './auth/socialLogin';
import resetPassword from './auth/resetPassword';
import { body } from 'express-validator';
import { specialTokenValidation } from '../middleware/specialTokenValidation';
import {
  forgotPasswordController,
  keepLoginController,
  loginAdminController,
  loginController,
  signUpController,
  verifyAccountController,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.get('/login/keep-login', validateToken, keepLoginController);
authRouter.post('/login/google', googleLogin);
authRouter.post('/login/admin', loginAdminController);
authRouter.post('/signup', signUpController);
authRouter.post('/signup/google', googleSignUp);
authRouter.patch(
  '/signup/verify-account',
  specialTokenValidation,
  verifyAccountController,
);
authRouter.post('/forgot', forgotPasswordController);
authRouter.patch(
  '/forgot/reset-password',
  specialTokenValidation,
  resetPassword,
);

export { authRouter };
