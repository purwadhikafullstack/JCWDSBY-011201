import { APP_URL, SCRT_KEY } from '../../config';
import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import { sendSignUpEmailVerification } from '../../helper/sendTemplateEmail';
import { createTokenService } from '../../services/token/token.service';
import {
  createUserService,
  findOneUserByEmailService,
} from '../../services/user/user.service';
import jwt from 'jsonwebtoken';

const signUp = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await findOneUserByEmailService(req.body.email);
    if (isExist) throw { rc: 400, message: 'Account already exist' };
    const result = await createUserService(
      { email: req.body.email, name: req.body.name },
      t,
    );
    const token = jwt.sign(
      {
        id: result.dataValues.id,
        name: result.dataValues.name,
        email: result.dataValues.email,
        method: 'VERIFY_ACCOUNT',
      },
      SCRT_KEY,
      { expiresIn: '1h' },
    );
    const resultToken = createTokenService(
      token,
      result.dataValues.id,
      'VERIFY_ACCOUNT',
      t,
    );
    await sendSignUpEmailVerification(
      result.dataValues.email,
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
