import jwt from 'jsonwebtoken';
import { findOneUserByEmailService } from '../../services/user/user.service';
import { verifyPassword } from '../../helper/hash';
import { SCRT_KEY } from '../../config';
import resTemplate from '../../helper/resTemplate';

const googleLogin = async (req, res, next) => {
  try {
    const isExist = await findOneUserByEmailService(req.body.email, 'google');
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
    return res.status(201).json(
      resTemplate(201, true, 'Login with google is success', {
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

export default googleLogin;
