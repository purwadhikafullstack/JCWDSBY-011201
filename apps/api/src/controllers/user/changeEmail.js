import jwt from 'jsonwebtoken';
import { DB } from '../../db';
import {
  findOneUserByEmailService,
  findOneUserByIdService,
  updateUserDataService,
} from '../../services/user/user.service';
import { SCRT_KEY } from '../../config';
import { createTokenService } from '../../services/token/token.service';
import { sendSignUpEmailVerification } from '../../helper/sendTemplateEmail';
import resTemplate from '../../helper/resTemplate';

const changeEmail = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    const userData = await findOneUserByIdService(req.tokenData.id);
    const isExist = await findOneUserByEmailService(req.body.newEmail);
    if (isExist) throw { rc: 401, message: 'New email is already registered' };
    if (req.body.newEmail === userData.dataValues.email)
      throw {
        rc: 401,
        message: 'New email must different from the current one',
      };
    const result = await updateUserDataService(
      { email: req.body.newEmail, isVerified: false },
      userData.dataValues.id,
      t,
    );
    const token = jwt.sign(
      {
        id: userData.dataValues.id,
        name: userData.dataValues.name,
        role: userData.dataValues.role,
        type: userData.dataValues.type,
        email: req.body.newEmail,
        method: 'VERIFY_EMAIL',
      },
      SCRT_KEY,
      { expiresIn: '1h' },
    );
    await createTokenService(token, userData.dataValues.id, 'VERIFY_EMAIL', t);
    await sendSignUpEmailVerification(
      req.body.newEmail,
      APP_URL + '/login/verify-email?key=' + token,
    );
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Email verification has been sent', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default changeEmail;
