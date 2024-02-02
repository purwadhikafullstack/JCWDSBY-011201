import { SCRT_KEY } from '../../config';
import { verifyPassword } from '../../helper/hash';
import resTemplate from '../../helper/resTemplate';
import userService from '../../services/user/user.service';
import jwt from 'jsonwebtoken';

const login = async (req, res, next) => {
  try {
    const result = await userService.findOneUserByEmail(req.body.email);
    if (!result.success) throw 'System Error';
    if (!result.result) throw { rc: 404, message: 'User not found' };
    if (result.result.dataValues.type === 'google')
      throw { rc: 401, message: 'Account is registered with google' };
    if (!result.result.dataValues.isVerified)
      throw { rc: 401, message: 'Please verify your account first' };
    const { id, email, name, role, image, type, password } =
      result.result.dataValues;
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

export default login;
