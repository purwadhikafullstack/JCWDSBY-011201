import { Router } from 'express';

const userRouter = Router();

// For user use ('/user')
userRouter.patch('/user');
userRouter.patch('/user/change-password');

// For admin use ('/admin')
// For super use ('/super')

export { userRouter };
