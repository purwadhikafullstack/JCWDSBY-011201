import { Router } from 'express';
import registerAdmin from './admin/registerAdmin';
import getAllUsers from './admin/getAllAdmin';
import changePasswordAdmin from './admin/changePasswordAdmin';
import updateUserAdmin from './admin/updateUserAdmin';
import deleteAdmin from './admin/deleteAdmin';

const adminRouter = Router();

adminRouter.get('/', getAllUsers);
adminRouter.post('/', registerAdmin)
adminRouter.post('/profile/:uuid', updateUserAdmin)
adminRouter.post('/:uuid', changePasswordAdmin)
adminRouter.delete('/:uuid', deleteAdmin)

export { adminRouter };