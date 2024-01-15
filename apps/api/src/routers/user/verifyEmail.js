import { APP_URL, SCRT_KEY } from '../../config';
import { findOneUser, updateUser } from '../../controllers/user.controller';
import { DB } from '../../db';
import jwt from 'jsonwebtoken';
import { sendSignUpEmailVerification } from '../../helper/sendTemplateEmail';
import { updateToken } from '../../controllers/token.controller';

export default async function verifyEmail(req, res, next) {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    if (req.tokenData.method !== 'VERIFY_EMAIL') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const result = await updateUser(
      { isVerified: true },
      {
        where: {
          id: req.tokenData.id,
          email: req.tokenData.email,
        },
        transaction: t,
      },
    );
    if (result[0] < 1) throw { rc: 404, message: 'Account not found' };
    await updateToken(
      { isValid: false },
      {
        where: { userId: req.tokenData.id, method: req.tokenData.method },
        transaction: t,
      },
    );
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success change email',
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
