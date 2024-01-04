import { createUser, findOneUser } from '../../controllers/auth.controller';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { verifyPassword } from '../../helper/hash';
import { Op } from 'sequelize';

export default async function googleLogin(req, res, next) {
  try {
    const isExist = await findOneUser({
      where: {
        [Op.and]: [{ email: req.body.email }, { type: 'google' }],
      },
    });
    if (!isExist) {
      throw { rc: 404, message: 'User not found' };
    }
    const { id, email, name, role, image, type, password } = isExist.dataValues;
    const compare = await verifyPassword(req.body.password, password);
    if (!compare) {
      throw { rc: 401, message: 'Email and password is not match' };
    }
    const token = jwt.sign(
      {
        id,
        name,
        email,
        role,
        type,
        method: 'AUTHORIZATION',
      },
      SCRT_KEY,
      { expiresIn: '7d' },
    );
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Login with google is success',
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
