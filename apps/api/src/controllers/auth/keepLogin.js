import { SCRT_KEY } from '../../config';
import resTemplate from '../../helper/resTemplate';
import { findOneAdminByUsernameService } from '../../services/user/admin.service';
import { findOneUserByEmailService } from '../../services/user/user.service';
import jwt from 'jsonwebtoken';

const keepLogin = async (req, res, next) => {
  try {
    if (req.tokenData.method !== 'AUTHORIZATION') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const resultResponse = {};
    const signedData = {};
    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      const result = await findOneAdminByUsernameService(req.tokenData.email);
      if (!result) throw { rc: 401, message: 'Unauthorized user' };
      signedData.id = result.dataValues.id;
      signedData.role = result.dataValues.role;
      signedData.name = result.dataValues.name;
      signedData.email = result.dataValues.email;
      signedData.type = result.dataValues.type;
      signedData.image = result.dataValues.image;
      signedData.storeId = result.dataValues.store?.id || null;
      signedData.storeUUID = result.dataValues.store?.UUID || null;
      resultResponse.role = result.dataValues.role;
      resultResponse.name = result.dataValues.name;
      resultResponse.email = result.dataValues.email;
      resultResponse.type = result.dataValues.type;
      resultResponse.image = result.dataValues.image;
    } else {
      const result = await findOneUserByEmailService(req.tokenData.email);
      if (!result) throw { rc: 401, message: 'Unauthorized user' };
      signedData.id = result.dataValues.id;
      signedData.role = result.dataValues.role;
      signedData.name = result.dataValues.name;
      signedData.email = result.dataValues.email;
      signedData.type = result.dataValues.type;
      signedData.image = result.dataValues.image;
      resultResponse.role = result.dataValues.role;
      resultResponse.name = result.dataValues.name;
      resultResponse.email = result.dataValues.email;
      resultResponse.type = result.dataValues.type;
      resultResponse.image = result.dataValues.image;
    }
    signedData.method = 'AUTHORIZATION';
    const token = jwt.sign(signedData, SCRT_KEY, { expiresIn: '7d' });
    resultResponse.token = token;
    resTemplate(201, true, 'Authorized user', resultResponse);
    return res
      .status(201)
      .json(resTemplate(201, true, 'Authorized user', resultResponse));
  } catch (error) {
    console.log(error.message);
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default keepLogin;
