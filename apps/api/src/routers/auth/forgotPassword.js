import { findOneUser } from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { Op } from 'sequelize';
import { sendResetPasswordEmail } from '../../helper/sendTemplateEmail';
import { createToken, updateToken } from '../../controllers/token.controller';
import { DB } from '../../db';

export default async function forgotPassword(req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await findOneUser({
      where: {
        [Op.and]: [{ email: req.body.email }],
      },
    });

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
    await updateToken(
      { isValid: false },
      { where: { userId: id, method: 'FORGOT_PASSWORD' }, transaction: t },
    );
    await createToken(token, id, 'FORGOT_PASSWORD', t);
    await sendResetPasswordEmail(
      isExist.dataValues.email,
      APP_URL + `/forgot/reset-password?key=` + token,
    );
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Email for password reset has been sent',
      result: null,
    });
  } catch (error) {
    console.log(error.message);
    await t.rollback();
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
