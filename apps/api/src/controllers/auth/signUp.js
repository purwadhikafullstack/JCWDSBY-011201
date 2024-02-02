import { APP_URL, SCRT_KEY } from '../../config';
import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import { sendSignUpEmailVerification } from '../../helper/sendTemplateEmail';
import tokenService from '../../services/token/token.service';
import userService from '../../services/user/user.service';
import jwt from 'jsonwebtoken';

const signUp = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await userService.findOneUserByEmail(req.body.email);
    if (!isExist.success) throw { rc: 500, message: isExist.result };
    if (isExist.result) throw { rc: 400, message: 'Account already exist' };
    const result = await userService.createUser(
      req.body.email,
      req.body.name,
      t,
    );
    if (!result.success) throw { rc: 500, message: isExist.result };
    console.log(result.result.dataValues.id);
    const token = jwt.sign(
      {
        id: result.result.dataValues.id,
        name: result.result.dataValues.name,
        email: result.result.dataValues.email,
        method: 'VERIFY_ACCOUNT',
      },
      SCRT_KEY,
      { expiresIn: '1h' },
    );
    const resultToken = await tokenService.createToken(
      token,
      result.result.dataValues.id,
      'VERIFY_ACCOUNT',
      t,
    );
    if (!resultToken.success) throw { rc: 500, message: resultToken.result };
    await sendSignUpEmailVerification(
      result.result.dataValues.email,
      APP_URL + '/signup/verify-account?key=' + token,
    );
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Email Verification has been sent', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default signUp;
