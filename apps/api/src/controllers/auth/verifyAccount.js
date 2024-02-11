import { validationResult } from 'express-validator';
import { APP_URL, SCRT_KEY } from '../../config';
import { DB } from '../../db';
import { hashPassword } from '../../helper/hash';
import resTemplate from '../../helper/resTemplate';
import { sendWelcomeEmail } from '../../helper/sendTemplateEmail';
import { deactivateTokenService } from '../../services/token/token.service';
import { verifyUserAccountService } from '../../services/user/user.service';

const verifyAccount = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw { rc: 400, message: 'Invalid request' };
    if (req.tokenData.method !== 'VERIFY_ACCOUNT') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const hashedPassword = await hashPassword(req.body.password, 10);
    console.log(req.tokenData.email);
    const result = await verifyUserAccountService(
      hashedPassword,
      req.tokenData.email,
      t,
    );
    if (!result[0]) {
      throw { rc: 404, message: 'Account not found' };
    }
    const deactivatedToken = await deactivateTokenService(
      req.tokenData.id,
      req.tokenData.method,
      t,
    );
    if (!deactivatedToken[0]) throw { rc: 404, message: 'token not found' };
    await sendWelcomeEmail(
      req.tokenData.email,
      APP_URL + '/login',
      req.tokenData.name,
    );
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Account verification success', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default verifyAccount;
