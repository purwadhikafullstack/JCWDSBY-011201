import { APP_URL, SCRT_KEY } from '../../config';
import { findOneUser, updateUser } from '../../controllers/user.controller';
import { DB } from '../../db';
import { verifyPassword } from '../../helper/hash';
import jwt from 'jsonwebtoken';
import { sendSignUpEmailVerification } from '../../helper/sendTemplateEmail';

export default async function changeEmail(req, res, next) {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    const userData = await findOneUser({
      where: {
        id: req.tokenData.id,
      },
    });
    const isExist = await findOneUser({ where: { email: req.body.newEmail } });
    if (isExist) throw { rc: 401, message: 'New email is already registered' };
    if (req.body.newEmail === userData.dataValues.email)
      throw {
        rc: 401,
        message: 'New email must different from the current one',
      };
    const result = await updateUser(
      { email: req.body.newEmail, isVerified: false },
      {
        where: {
          id: req.tokenData.id,
        },
        transaction: t,
      },
    );
    console.log(req.tokenData);
    const { id, name, role, type } = req.tokenData;
    const token = jwt.sign(
      {
        id,
        name,
        role,
        type,
        email: req.body.newEmail,
        method: 'VERIFY_ACCOUNT',
      },
      SCRT_KEY,
      { expiresIn: '3h' },
    );
    await sendSignUpEmailVerification(
      req.body.newEmail,
      APP_URL + '/login/verify-email?key=' + token,
    );
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Email verification has been sent',
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
