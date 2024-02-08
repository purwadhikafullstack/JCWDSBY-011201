import forgotPassword from './auth/forgotPassword';
import googleLogin from './auth/googleLogin';
import googleSignUp from './auth/googleSignup';
import keepLogin from './auth/keepLogin';
import login from './auth/login';
import loginAdmin from './auth/loginAdmin';
import resetPassword from './auth/resetPassword';
import signUp from './auth/signUp';
import verifyAccount from './auth/verifyAccount';

export const loginController = login;
export const signUpController = signUp;
export const verifyAccountController = verifyAccount;
export const forgotPasswordController = forgotPassword;
export const loginAdminController = loginAdmin;
export const keepLoginController = keepLogin;
export const resetPasswordController = resetPassword;
export const googleLoginController = googleLogin;
export const googleSignUpController = googleSignUp;
