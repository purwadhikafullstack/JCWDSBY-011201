import { createUser, findOneUser } from '../../controllers/auth.controller';
import transporter from '../../helper/mailer';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { Sequelize } from 'sequelize';
import { DB } from '../../db';

export default async function signUp(req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await findOneUser({
      where: {
        email: req.body.email,
      },
    });
    if (isExist) {
      throw { rc: 400, message: 'Account already exist' };
    }
    const result = await createUser(
      {
        name: req.body.name,
        email: req.body.email,
      },
      { transaction: t },
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
    await transporter.sendMail({
      to: result.dataValues.email,
      subject: 'Verify Account',
      sender: 'COSMO',
      html: `<h1>Verify Account</h1><p>Verify your account by clicking link below</p><br><a href="${
        APP_URL + `/signup/verify-account?key=` + token
      }">Verify Account</a><br><p>This token only valid for 1 hour</p><br><p>Note: If you are not request this just ignore it</p>`,
    });
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Email Verification has been sent',
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
