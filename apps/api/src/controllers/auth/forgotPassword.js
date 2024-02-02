import { APP_URL, SCRT_KEY } from '../../config';
import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import { sendResetPasswordEmail } from '../../helper/sendTemplateEmail';
import tokenService from '../../services/token/token.service';
import userService from '../../services/user/user.service';
import jwt from 'jsonwebtoken';

const forgotPassword = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await userService.findOneUserByEmail(req.body.email);
    if (!isExist.result) throw { rc: 404, message: 'Account is not found' };
    if (isExist.result.dataValues.type !== 'regular')
      throw {
        rc: 401,
        message: 'Cannot reset account registered with social account',
      };
    const { id, name, email, role } = isExist.result.dataValues;
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
    const deactivateToken = await tokenService.deactivateToken(
      id,
      'FORGOT_PASSWORD',
      t,
    );
    if (!deactivateToken.success) throw { message: deactivateToken.result };
    const createToken = await tokenService.createToken(
      token,
      id,
      'FORGOT_PASSWORD',
      t,
    );
    if (!createToken.success) throw { message: createToken.result };
    await sendResetPasswordEmail(
      isExist.result.dataValues.email,
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
