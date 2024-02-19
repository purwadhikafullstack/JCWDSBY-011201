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

authRouter.post(
  '/login',
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  loginController,
);
authRouter.get('/login/keep-login', validateToken, keepLoginController);
authRouter.post(
  '/login/google',
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  googleLoginController,
);
authRouter.post(
  '/login/admin',
  body('username').notEmpty(),
  body('password').notEmpty(),
  loginAdminController,
);
authRouter.post(
  '/signup',
  body('email').notEmpty().isEmail(),
  signUpController,
);
authRouter.post(
  '/signup/google',
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  googleSignUpController,
);
authRouter.patch(
  '/signup/verify-account',
  specialTokenValidation,
  body('password')
    .notEmpty()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/),
  body('confPass')
    .notEmpty()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/),
  verifyAccountController,
);
authRouter.post(
  '/forgot',
  body('email').notEmpty().isEmail(),
  forgotPasswordController,
);
authRouter.patch(
  '/forgot/reset-password',
  specialTokenValidation,
  body('password')
    .notEmpty()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/),
  body('confPass')
    .notEmpty()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/),
  resetPasswordController,
);

export { authRouter };
