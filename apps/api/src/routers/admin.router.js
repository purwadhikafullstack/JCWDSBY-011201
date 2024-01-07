import { Router } from 'express';
import registerAdmin from './admin/registerAdmin';
import changePasswordAdmin from './admin/changePasswordAdmin';
import updateUserAdmin from './admin/updateUserAdmin';
import deleteAdmin from './admin/deleteAdmin';
import getAllAdmin from './admin/getAllAdmin';

const adminRouter = Router();

adminRouter.get('/', getAllAdmin);
adminRouter.post('/', registerAdmin)
adminRouter.post('/profile/:uuid', updateUserAdmin)
adminRouter.post('/:uuid', changePasswordAdmin)
adminRouter.delete('/:uuid', deleteAdmin)

export { adminRouter };