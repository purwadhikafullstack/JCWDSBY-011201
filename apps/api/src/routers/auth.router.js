import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation';
import { body } from 'express-validator';
import { specialTokenValidation } from '../middleware/specialTokenValidation';
import {
  forgotPasswordController,
  googleLoginController,
  googleSignUpController,
  keepLoginController,
  loginAdminController,
  loginController,
  resetPasswordController,
  signUpController,
  verifyAccountController,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.get('/login/keep-login', validateToken, keepLoginController);
authRouter.post('/login/google', googleLoginController);
authRouter.post('/login/admin', loginAdminController);
authRouter.post('/signup', signUpController);
authRouter.post('/signup/google', googleSignUpController);
authRouter.patch(
  '/signup/verify-account',
  specialTokenValidation,
  verifyAccountController,
);
authRouter.post('/forgot', forgotPasswordController);
authRouter.patch(
  '/forgot/reset-password',
  specialTokenValidation,
  resetPasswordController,
);

export { authRouter };
