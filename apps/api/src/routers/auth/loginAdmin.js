import {
  createUser,
  findOneUser,
  findAllUser,
} from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import { SCRT_KEY } from '../../config';
import { verifyPassword } from '../../helper/hash';
import { Op } from 'sequelize';
import stores from '../../models/stores.model';

export default async function loginAdmin(req, res, next) {
  try {
    const isExist = await findOneUser({
      include: {
        model: stores,
        required: false,
      },
      where: {
        [Op.and]: [
          { email: req.body.username },
          { [Op.or]: [{ role: 'admin' }, { role: 'super' }] },
        ],
      },
    });
    if (!isExist) {
      throw { rc: 404, message: 'User not found' };
    }
    const { id, email, name, role, image, type, password } = isExist.dataValues;
    const compare = await verifyPassword(req.body.password, password);
    if (!compare) {
      throw { rc: 401, message: 'Password is no match' };
    }
    const token = jwt.sign(
      {
        id,
        email,
        name,
        role,
        type,
        storeId: isExist.dataValues.store?.id || null,
        storeUUID: isExist.dataValues.store?.UUID || null,
        method: 'AUTHORIZATION',
      },
      SCRT_KEY,
      { expiresIn: '7d' },
    );
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Login successfully',
      result: {
        name,
        email,
        role,
        image,
        type,
        token,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
