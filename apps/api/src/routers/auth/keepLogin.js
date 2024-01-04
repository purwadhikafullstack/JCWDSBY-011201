import { Op } from 'sequelize';
import { findOneUser } from '../../controllers/auth.controller';
import jwt from 'jsonwebtoken';
import { SCRT_KEY } from '../../config';
import stores from '../../models/stores.model';

export default async function keepLogin(req, res, next) {
  try {
    if (req.tokenData.method !== 'AUTHORIZATION') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    let parameter = {};
    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      parameter = {
        where: {
          [Op.and]: [
            { id: req.tokenData.id },
            { email: req.tokenData.email },
            { name: req.tokenData.name },
            { role: req.tokenData.role },
          ],
        },
        include: {
          model: stores,
          required: false,
        },
      };
    } else {
      parameter = {
        where: {
          [Op.and]: [
            { id: req.tokenData.id },
            { email: req.tokenData.email },
            { name: req.tokenData.name },
            { role: req.tokenData.role },
          ],
        },
      };
    }
    const result = await findOneUser(parameter);
    if (!result) {
      throw { rc: 401, message: 'Unauthorized user' };
    }
    const { id, name, email, role, image, type } = result.dataValues;
    let signedData = {};
    if (
      result.dataValues.role === 'admin' ||
      result.dataValues.role === 'super'
    ) {
      signedData = {
        id,
        name,
        email,
        role,
        type,
        storeId: result.dataValues.store?.id || null,
        method: 'AUTHORIZATION',
      };
    } else {
      signedData = {
        id,
        name,
        email,
        role,
        type,
        method: 'AUTHORIZATION',
      };
    }
    const token = jwt.sign(signedData, SCRT_KEY, { expiresIn: '7d' });
    return res.status(201).json({
      success: true,
      message: 'Authorized user',
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
      success: false,
      message: error.message,
      result: null,
    });
  }
}
