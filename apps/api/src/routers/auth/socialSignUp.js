import { createUser, findOneUser } from '../../controllers/user.controller';
import transporter from '../../helper/mailer';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { hashPassword } from '../../helper/hash';
import { Sequelize } from 'sequelize';
import { DB } from '../../db';
import { sendWelcomeEmail } from '../../helper/sendTemplateEmail';

export default async function googleSignUp(req, res, next) {
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
    const hashedPassword = await hashPassword(req.body.password, 10);
    const result = await createUser(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        type: 'google',
      },
      { transaction: t },
    );
    const { id, name, email, role, type, image } = result.dataValues;
    const token = jwt.sign(
      {
        id,
        name,
        email,
        role,
        type,
        method: 'AUTHORIZATION',
      },
      SCRT_KEY,
      { expiresIn: '7d' },
    );
    await sendWelcomeEmail(email, APP_URL + '/login', name);
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Sign Up using google is success',
      result: {
        name,
        email,
        role,
        image,
        type,
        token,
      },
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
