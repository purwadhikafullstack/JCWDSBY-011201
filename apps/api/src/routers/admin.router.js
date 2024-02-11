import { Router } from 'express';
import registerAdmin from './admin/registerAdmin';
import changePasswordAdmin from './admin/changePasswordAdmin';
import updateUserAdmin from './admin/updateUserAdmin';
import deleteAdmin from './admin/deleteAdmin';
import getAllAdmin from './admin/getAllAdmin';
import getAdminDetail from './admin/getAdminDetail';
import { findAllAddminServiceTemp } from '../services/user/admin.service';
import resTemplate from '../helper/resTemplate';

const adminRouter = Router();

adminRouter.get('/', getAllAdmin);
adminRouter.get('/temp', async (req, res, next) => {
  try {
    const result = await findAllAddminServiceTemp();
    return res
      .status(200)
      .send(resTemplate(200, true, 'Success get all admin', result));
  } catch (error) {
    next(error);
  }
});
adminRouter.get('/:uuid', getAdminDetail);
adminRouter.post('/', registerAdmin);
adminRouter.patch('/profile/:uuid', updateUserAdmin);
adminRouter.patch('/:uuid', changePasswordAdmin);
adminRouter.delete('/:uuid', deleteAdmin);

export { adminRouter };
