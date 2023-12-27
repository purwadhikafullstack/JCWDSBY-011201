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

const authRouter = Router();

authRouter.get('/keep-login', validateToken, keepLogin);
authRouter.post('/login', login);
authRouter.post('/login/google', googleLogin);
authRouter.post('/login/admin', loginAdmin);
authRouter.post('/signup', signUp);
authRouter.post('/signup/google', googleSignUp);
authRouter.patch('/verify-account', validateToken, verifyAccount);
authRouter.post('/forgot', forgotPassword);
authRouter.patch('/reset-password', validateToken, resetPassword);

export { authRouter };
