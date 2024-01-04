import { Op, Sequelize } from 'sequelize';
import { APP_URL } from '../../config';
import { updateUser } from '../../controllers/user.controller';
import { hashPassword } from '../../helper/hash';
import transporter from '../../helper/mailer';
import { DB } from '../../db';

export default async function resetPassword(req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    if (req.tokenData.method !== 'FORGOT_PASSWORD') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const hashedPassword = await hashPassword(req.body.password, 10);
    const result = await updateUser(
      {
        password: hashedPassword,
      },
      {
        where: {
          [Op.and]: [{ id: req.tokenData.id }, { type: 'regular' }],
        },
        transaction: t,
      },
    );
    if (!result[0]) {
      throw { rc: 404, message: 'Account not found' };
    }
    await transporter.sendMail({
      to: req.tokenData.email,
      subject: `Reset Password Successfullty`,
      sender: 'COSMO',
      html: `<h1>Your password is reseted</h1><p>Login to your account with new password</p><br><a href="${
        APP_URL + `/login`
      }">Go to Cosmo</a><br><p>Hope you not forgot again :)</p><br>`,
    });
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success reset password',
      result: null,
    });
  } catch (error) {
    await t.rollback();
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
