import { Op } from 'sequelize';
import { findOneUser } from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import { SCRT_KEY } from '../../config';
import stores from '../../models/stores.model';

export default async function keepLogin(req, res, next) {
  try {
    if (req.tokenData.method !== 'AUTHORIZATION') {
      throw { rc: 401, message: 'Unauthorized token' };
    }

    const parameter = {
      where: {
        [Op.and]: [{ id: req.tokenData.id }, { role: req.tokenData.role }],
      },
    };

    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      parameter.include = {
        model: stores,
        required: false,
      };
    }

    const result = await findOneUser(parameter);
    if (!result) {
      throw { rc: 401, message: 'Unauthorized user' };
    }
    const { id, name, email, role, image, type } = result.dataValues;
    const signedData = { id, name, email, role, type, method: 'AUTHORIZATION' };
    if (
      result.dataValues.role === 'admin' ||
      result.dataValues.role === 'super'
    ) {
      signedData.storeId = result.dataValues.store?.id || null;
      signedData.storeUUID = result.dataValues.store?.UUID || null;
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
