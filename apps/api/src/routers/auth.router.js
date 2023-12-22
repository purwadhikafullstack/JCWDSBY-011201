import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation';
import signUp from './auth/signup';
import login from './auth/login';
import verifyAccount from './auth/verifyAccount';
import googleSignUp from './auth/socialsignup';
import googleLogin from './auth/socialLogin';
import loginAdmin from './auth/loginAdmin';
import keepLogin from './auth/keepLogin';

const authRouter = Router();

authRouter.post('/keep-login', validateToken, keepLogin);
authRouter.post('/login', login);
authRouter.post('/login/google', googleLogin);
authRouter.post('/login/admin', loginAdmin);
authRouter.post('/signup', signUp);
authRouter.post('/signup/google', googleSignUp);
authRouter.patch('/verify-account', validateToken, verifyAccount);

export { authRouter };
