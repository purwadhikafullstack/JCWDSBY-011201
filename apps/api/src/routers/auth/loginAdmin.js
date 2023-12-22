import { createUser, findUser } from '../../controllers/auth.controller';
import jwt from 'jsonwebtoken';
import { SCRT_KEY } from '../../config';
import { verifyPassword } from '../../helper/hash';
import { Op } from 'sequelize';

export default async function loginAdmin(req, res, next) {
  try {
    const isExist = await findUser({
      [Op.and]: [
        { email: req.body.username },
        { [Op.or]: [{ role: 'admin' }, { role: 'super' }] },
      ],
    });
    if (!isExist) {
      throw { rc: 404, message: 'User not found' };
    }
    const { id, email, name, role, password } = isExist.dataValues;
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
      },
      SCRT_KEY,
      { expiresIn: '7d' },
    );
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Login successfully',
      result: {
        email: email,
        name: name,
        role: role,
        token: token,
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
