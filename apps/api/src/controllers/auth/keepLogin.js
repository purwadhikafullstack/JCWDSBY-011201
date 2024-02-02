import { SCRT_KEY } from '../../config';
import resTemplate from '../../helper/resTemplate';
import adminService from '../../services/user/admin.service';
import userService from '../../services/user/user.service';
import jwt from 'jsonwebtoken';

const keepLogin = async (req, res, next) => {
  try {
    if (req.tokenData.method !== 'AUTHORIZATION') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const resultResponse = {};
    const signedData = {};
    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      const result = await adminService.findOneAdminByUsername(
        req.tokenData.email,
      );
      if (!result.success) throw { message: result.result };
      if (!result.result) throw { rc: 401, message: 'Unauthorized user' };
      signedData.id = result.result.dataValues.id;
      signedData.role = result.result.dataValues.role;
      signedData.name = result.result.dataValues.name;
      signedData.email = result.result.dataValues.email;
      signedData.type = result.result.dataValues.type;
      signedData.image = result.result.dataValues.image;
      signedData.storeId = result.result.dataValues.store?.id || null;
      signedData.storeUUID = result.result.dataValues.store?.UUID || null;
      resultResponse.role = result.result.dataValues.role;
      resultResponse.name = result.result.dataValues.name;
      resultResponse.email = result.result.dataValues.email;
      resultResponse.type = result.result.dataValues.type;
      resultResponse.image = result.result.dataValues.image;
    } else {
      const result = await userService.findOneUserByEmail(req.tokenData.email);
      if (!result.success) throw { message: result.result };
      if (!result.result) throw { rc: 401, message: 'Unauthorized user' };
      signedData.id = result.result.dataValues.id;
      signedData.role = result.result.dataValues.role;
      signedData.name = result.result.dataValues.name;
      signedData.email = result.result.dataValues.email;
      signedData.type = result.result.dataValues.type;
      signedData.image = result.result.dataValues.image;
      resultResponse.role = result.result.dataValues.role;
      resultResponse.name = result.result.dataValues.name;
      resultResponse.email = result.result.dataValues.email;
      resultResponse.type = result.result.dataValues.type;
      resultResponse.image = result.result.dataValues.image;
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
