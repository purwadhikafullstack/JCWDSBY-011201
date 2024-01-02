import { findOneUser } from '../../controllers/auth.controller';
import transporter from '../../helper/mailer';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { Op } from 'sequelize';

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
    await transporter.sendMail({
      to: isExist.dataValues.email,
      subject: 'Forgot Password',
      sender: 'COSMO',
      html: `<h1>Forgot Password</h1><p>Reset your account password by clicking link below</p><br><a href="${
        APP_URL + `/forgot/reset-password?key=` + token
      }" target="__blank">Reset Password</a><br><p>This token only valid for 1 hour</p><br><p>Note: If you are not request this just ignore it</p>`,
    });
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
