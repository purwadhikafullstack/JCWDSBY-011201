import { DB } from '../../db';
import { hashPassword } from '../../helper/hash';
import resTemplate from '../../helper/resTemplate';
import { sendSuccessResetPasswordEmail } from '../../helper/sendTemplateEmail';
import { deactivateTokenService } from '../../services/token/token.service';
import { updateUserPasswordService } from '../../services/user/user.service';

const resetPassword = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    if (req.tokenData.method !== 'FORGOT_PASSWORD') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const hashedPassword = await hashPassword(req.body.password, 10);
    const result = await updateUserPasswordService(
      hashedPassword,
      req.tokenData.id,
      t,
    );
    if (!result[0]) throw { rc: 404, message: 'Account not found' };
    const deactivatedToken = await deactivateTokenService(
      req.tokenData.id,
      'FORGOT_PASSWORD',
      t,
    );
    if (!deactivatedToken[0]) throw { rc: 404, message: 'token not found' };
    await sendSuccessResetPasswordEmail(
      req.tokenData.email,
      APP_URL + `/login`,
    );
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success reset password', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default resetPassword;
