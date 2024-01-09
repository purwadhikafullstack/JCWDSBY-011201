import { findOneUser } from '../../controllers/user.controller';
import transporter from '../../helper/mailer';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { Op } from 'sequelize';
import { sendResetPasswordEmail } from '../../helper/sendTemplateEmail';

export default async function forgotPassword(req, res, next) {
  try {
    const isExist = await findOneUser({
      where: {
        [Op.and]: [{ email: req.body.email }, { type: 'regular' }],
      },
    });
    if (!isExist) {
      throw { rc: 404, message: 'Account is not found' };
    }
    const { id, name, email, role } = isExist.dataValues;
    const token = jwt.sign(
      {
        id,
        name,
        email,
        method: 'FORGOT_PASSWORD',
      },
      SCRT_KEY,
      { expiresIn: '1h' },
    );
    await sendResetPasswordEmail(
      isExist.dataValues.email,
      APP_URL + `/forgot/reset-password?key=` + token,
    );
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Email for password reset has been sent',
      result: null,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
