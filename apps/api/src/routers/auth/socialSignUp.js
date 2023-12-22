import { createUser, findUser } from '../../controllers/auth.controller';
import transporter from '../../helper/mailer';
import jwt from 'jsonwebtoken';
import { APP_URL, SCRT_KEY } from '../../config';
import { hashPassword } from '../../helper/hash';

export default async function googleSignUp(req, res, next) {
  try {
    const isExist = await findUser({
      email: req.body.email,
    });
    if (isExist) {
      throw { rc: 400, message: 'Account already exist' };
    }
    const hashedPassword = await hashPassword(req.body.password, 10);
    const result = await createUser({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isVerified: true,
    });
    const { id, name, email, role } = result.dataValues;
    const token = jwt.sign(
      {
        id,
        name,
        email,
        role,
      },
      SCRT_KEY,
      { expiresIn: '7d' },
    );
    await transporter.sendMail({
      to: email,
      subject: `Welcome to Cosmo ${name}`,
      sender: 'COSMO',
      html: `<h1>Welcome to Cosmo</h1><p>Start your journey by clicking link below</p><br><a href="${
        APP_URL + `/`
      }">Go to Cosmo</a><br><p>Hope you find the best experience</p><br>`,
    });
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Sign Up using google is success',
      result: {
        name,
        email,
        role,
        token,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
