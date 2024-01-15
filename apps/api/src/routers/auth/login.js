import {
  createUser,
  findOneUser,
  findUser,
} from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import { SCRT_KEY } from '../../config';
import { verifyPassword } from '../../helper/hash';
import { Op } from 'sequelize';
import { body, validationResult } from 'express-validator';

export default async function login(req, res, next) {
  try {
    const isExist = await findOneUser({
      where: {
        [Op.and]: [{ email: req.body.email }],
      },
    });
    if (!isExist) throw { rc: 404, message: 'User not found' };
    if (isExist.dataValues.type === 'google')
      throw { rc: 401, message: 'Account is registered with google' };
    if (!isExist.dataValues.isVerified)
      throw { rc: 401, message: 'Please verify your account first' };
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
