import { Router } from 'express';
import { validateSuper, validateToken } from '../middleware/tokenValidation';
import { getAdmin, getAdminDetail, registerAdmin, updateAdmin, changePasswordAdmin, deleteAdmin } from '../controllers/admin.controller';

const adminRouter = Router();

adminRouter.get('/', validateToken, validateSuper, getAdmin);
adminRouter.get('/:uuid', validateToken, validateSuper, getAdminDetail);
adminRouter.post('/', validateToken, validateSuper, registerAdmin)
adminRouter.patch('/profile/:uuid', validateToken, validateSuper, updateAdmin)
adminRouter.patch('/:uuid', validateToken, validateSuper, changePasswordAdmin)
adminRouter.delete('/:uuid', validateToken, validateSuper, deleteAdmin)

export { adminRouter };