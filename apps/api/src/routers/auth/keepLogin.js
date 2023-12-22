import { Op } from 'sequelize';
import { findUser } from '../../controllers/auth.controller';
import jwt from 'jsonwebtoken';
import { SCRT_KEY } from '../../config';

export default async function keepLogin(req, res, next) {
  try {
    const result = await findUser({
      [Op.and]: [
        { id: req.tokenData.id },
        { email: req.tokenData.email },
        { name: req.tokenData.name },
        { role: req.tokenData.role },
      ],
    });
    if (!result) {
      throw { rc: 401, message: 'Unauthorized user' };
    }
    const { id, name, email, role, image } = result.dataValues;
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
      success: true,
      message: 'Authorized user',
      result: {
        name,
        email,
        role,
        image,
        token,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      success: false,
      message: error.message,
      result: null,
    });
  }
}
