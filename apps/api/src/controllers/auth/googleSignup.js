import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { hashPassword } from '../../helper/hash';
import { sendWelcomeEmail } from '../../helper/sendTemplateEmail';
import { DB } from '../../db';
import {
  createUserService,
  findOneUserByEmailAndTypeService,
} from '../../services/user/user.service';
import resTemplate from '../../helper/resTemplate';

const googleSignUp = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await findOneUserByEmailAndTypeService(
      req.body.email,
      'google',
    );
    if (isExist) {
      throw { rc: 400, message: 'Account already exist' };
    }
    const hashedPassword = await hashPassword(req.body.password, 10);
    const result = await createUserService(
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
    return res.status(201).json(
      resTemplate(201, true, 'Sign Up with google is success', {
        name,
        email,
        role,
        image,
        type,
        token,
      }),
    );
  } catch (error) {
    console.log(error.message);
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default googleSignUp;
