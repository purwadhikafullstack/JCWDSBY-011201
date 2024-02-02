import { SCRT_KEY } from '../../config';
import { verifyPassword } from '../../helper/hash';
import resTemplate from '../../helper/resTemplate';
import adminService from '../../services/user/admin.service';
import jwt from 'jsonwebtoken';

const loginAdmin = async (req, res, next) => {
  try {
    const isExist = await adminService.findOneAdminByUsername(
      req.body.username,
    );
    if (!isExist.success) throw { message: isExist.result };
    if (!isExist.result) throw { rc: 404, message: 'User not found' };
    const { id, email, name, role, image, type, password } =
      isExist.result.dataValues;
    const compare = await verifyPassword(req.body.password, password);
    if (!compare) throw { rc: 401, message: 'Password is no match' };
    const token = jwt.sign(
      {
        id,
        email,
        name,
        role,
        type,
        storeId: isExist.result.dataValues.store?.id || null,
        storeUUID: isExist.result.dataValues.store?.UUID || null,
        method: 'AUTHORIZATION',
      },
      SCRT_KEY,
      { expiresIn: '7d' },
    );
    return res.status(201).json(
      resTemplate(201, true, 'Login Success', {
        name,
        email,
        role,
        image,
        type,
        token,
      }),
    );
  } catch (error) {
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default loginAdmin;
