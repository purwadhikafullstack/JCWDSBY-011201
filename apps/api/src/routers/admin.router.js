import { Router } from 'express';
import registerAdmin from './admin/registerAdmin';
import changePasswordAdmin from './admin/changePasswordAdmin';
import updateUserAdmin from './admin/updateUserAdmin';
import deleteAdmin from './admin/deleteAdmin';
import getAllAdmin from './admin/getAllAdmin';
import getAdminDetail from './admin/getAdminDetail';

const adminRouter = Router();

adminRouter.get('/', getAllAdmin);
adminRouter.get('/:uuid', getAdminDetail);
adminRouter.post('/', registerAdmin)
adminRouter.patch('/profile/:uuid', updateUserAdmin)
adminRouter.patch('/:uuid', changePasswordAdmin)
adminRouter.delete('/:uuid', deleteAdmin)

export { adminRouter };