import { Op } from 'sequelize';
import { APP_URL } from '../../config';
import { updateUser } from '../../controllers/auth.controller';
import { hashPassword } from '../../helper/hash';
import transporter from '../../helper/mailer';

export default async function verifyAccount(req, res, next) {
  try {
    const hashedPassword = await hashPassword(req.body.password, 10);
    const result = await updateUser(
      {
        password: hashedPassword,
        isVerified: true,
      },
      {
        [Op.and]: [
          { id: req.tokenData.id },
          { email: req.tokenData.email },
          { name: req.tokenData.name },
        ],
      },
    );
    await transporter.sendMail({
      to: req.tokenData.email,
      subject: `Welcome to Cosmo ${req.tokenData.name}`,
      sender: 'COSMO',
      html: `<h1>Welcome to Cosmo</h1><p>Start your journey by clicking link below</p><br><a href="${
        APP_URL + `/login`
      }">Go to Cosmo</a><br><p>Hope you find the best experience</p><br>`,
    });
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Account verification success',
      result: null,
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
