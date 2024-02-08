import { APP_URL, SCRT_KEY } from '../../config';
import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import { sendResetPasswordEmail } from '../../helper/sendTemplateEmail';
import {
  createTokenService,
  deactivateTokenService,
} from '../../services/token/token.service';
import { findOneUserByEmailService } from '../../services/user/user.service';
import jwt from 'jsonwebtoken';

const forgotPassword = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await findOneUserByEmailService(req.body.email);
    if (!isExist) throw { rc: 404, message: 'Account is not found' };
    if (isExist.dataValues.type !== 'regular')
      throw {
        rc: 401,
        message: 'Cannot reset account registered with social account',
      };
    const { id, name, email, role } = isExist.dataValues;
    const token = jwt.sign(
      {
        id,
        name,
        email,
        role,
        method: 'FORGOT_PASSWORD',
      },
      SCRT_KEY,
      { expiresIn: '1h' },
    );
    const deactiveToken = await deactivateTokenService(
      id,
      'FORGOT_PASSWORD',
      t,
    );
    if (!deactiveToken[0]) throw { message: 'Token not found' };
    const saveToken = await createTokenService(token, id, 'FORGOT_PASSWORD', t);
    await sendResetPasswordEmail(
      isExist.dataValues.email,
      APP_URL + `/forgot/reset-password?key=` + token,
    );
    await t.commit();
    return res
      .status(201)
      .json(
        resTemplate(201, true, 'Email for password reset has been sent', null),
      );
  } catch (error) {
    console.log(error.message);
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default forgotPassword;
