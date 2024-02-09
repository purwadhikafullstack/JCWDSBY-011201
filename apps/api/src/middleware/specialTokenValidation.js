import { APP_URL, SCRT_KEY } from '../config';
import jwt from 'jsonwebtoken';
import {
  sendResetPasswordEmail,
  sendSignUpEmailVerification,
} from '../helper/sendTemplateEmail';
import { DB } from '../db';
import {
  createTokenService,
  deactivateTokenService,
  findValidTokenService,
} from '../services/token/token.service';
import resTemplate from '../helper/resTemplate';

export const specialTokenValidation = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw { rc: 401, message: 'Missing token' };
    const isExist = await findValidTokenService(token);
    if (!isExist) throw { rc: 401, message: 'Token not valid' };
    if (
      new Date(isExist.dataValues.validUntil).getTime() <= new Date().getTime()
    ) {
      const { id, name, email, role, type, method } = jwt.decode(token);
      const newToken = jwt.sign(
        { id, name, email, role, type, method },
        SCRT_KEY,
        { expiresIn: '1h' },
      );
      if (isExist.dataValues.method === 'VERIFY_ACCOUNT') {
        await sendSignUpEmailVerification(
          email,
          APP_URL + '/signup/verify-account?key=' + newToken,
        );
      }
      if (isExist.dataValues.method === 'VERIFY_EMAIL') {
        await sendSignUpEmailVerification(
          email,
          APP_URL + '/login/verify-email?key=' + newToken,
        );
      }
      if (isExist.dataValues.method === 'FORGOT_PASSWORD') {
        await sendResetPasswordEmail(
          email,
          APP_URL + '/forgot/reset-password?key=' + newToken,
        );
      }
      await deactivateTokenService(id, method, t);
      await createTokenService(newToken, id, isExist.dataValues.method, t);
      await t.commit();
      return res
        .status(401)
        .json(
          resTemplate(
            401,
            false,
            'Token expired, new token has been sent to your email',
            null,
          ),
        );
    }
    const tokenData = jwt.verify(token, SCRT_KEY);
    req.tokenData = tokenData;
    return next();
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};
