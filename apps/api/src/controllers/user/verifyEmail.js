import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import { deactivateTokenService } from '../../services/token/token.service';
import { updateUserDataService } from '../../services/user/user.service';

const verifyEmail = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    if (req.tokenData.method !== 'VERIFY_EMAIL') {
      throw { rc: 401, message: 'Unauthorized token' };
    }
    const result = await updateUserDataService(
      { isVerified: true },
      req.tokenData.id,
      t,
    );
    if (result[0] < 1) throw { rc: 404, message: 'Account not found' };
    await deactivateTokenService(req.tokenData.id, req.tokenData.method, t);
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success change email', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default verifyEmail;
