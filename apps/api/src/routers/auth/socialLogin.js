import { createUser, findUser } from '../../controllers/auth.controller';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { verifyPassword } from '../../helper/hash';

export default async function googleLogin(req, res, next) {
  try {
    const isExist = await findUser({
      email: req.body.email,
    });
    if (!isExist) {
      throw { rc: 404, message: 'User not found' };
    }
    const { id, email, name, role, password } = isExist.dataValues;
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
