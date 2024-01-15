import { Op, Sequelize } from 'sequelize';
import { APP_URL } from '../../config';
import { updateUser } from '../../controllers/user.controller';
import { hashPassword } from '../../helper/hash';
import transporter from '../../helper/mailer';
import { DB } from '../../db';
import { sendWelcomeEmail } from '../../helper/sendTemplateEmail';
import { updateToken } from '../../controllers/token.controller';

export default async function verifyAccount(req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    if (req.tokenData.method !== 'VERIFY_ACCOUNT') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const hashedPassword = await hashPassword(req.body.password, 10);
    const result = await updateUser(
      {
        password: hashedPassword,
        isVerified: true,
      },
      {
        where: {
          [Op.and]: [{ id: req.tokenData.id }, { email: req.tokenData.email }],
        },
        transaction: t,
      },
    );
    if (!result[0]) {
      throw { rc: 404, message: 'Account not found' };
    }
    await updateToken(
      { isValid: false },
      {
        where: { userId: req.tokenData.id, method: req.tokenData.method },
        transaction: t,
      },
    );
    await sendWelcomeEmail(
      req.tokenData.email,
      APP_URL + '/login',
      req.tokenData.name,
    );
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Account verification success',
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
