import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation';
import login from './auth/login';
import verifyAccount from './auth/verifyAccount';
import googleSignUp from './auth/socialSignUp';
import googleLogin from './auth/socialLogin';
import loginAdmin from './auth/loginAdmin';
import keepLogin from './auth/keepLogin';
import signUp from './auth/signUp';
import forgotPassword from './auth/forgotPassword';
import resetPassword from './auth/resetPassword';
import { body } from 'express-validator';
import { specialTokenValidation } from '../middleware/specialTokenValidation';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/login/keep-login', validateToken, keepLogin);
authRouter.post('/login/google', googleLogin);
authRouter.post('/login/admin', loginAdmin);
authRouter.post('/signup', signUp);
authRouter.post('/signup/google', googleSignUp);
authRouter.patch(
  '/signup/verify-account',
  specialTokenValidation,
  verifyAccount,
);
authRouter.post('/forgot', forgotPassword);
authRouter.patch(
  '/forgot/reset-password',
  specialTokenValidation,
  resetPassword,
);

export { authRouter };
