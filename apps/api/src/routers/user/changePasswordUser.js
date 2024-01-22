import { findOneUser, updateUser } from '../../controllers/user.controller';
import { DB } from '../../db';
import { hashPassword, verifyPassword } from '../../helper/hash';

export default async function changePassword(req, res, next) {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    const userData = await findOneUser({
      where: {
        id: req.tokenData.id,
      },
    });
    const isValid = await verifyPassword(
      req.body.currPassword,
      userData.dataValues.password,
    );
    if (!isValid) throw { rc: 401, message: 'Wrong password' };
    if (req.body.currPassword === req.body.newPassword) {
      throw {
        rc: 401,
        message: 'New password must different from current password',
      };
    }
    const newHashedPassword = await hashPassword(req.body.newPassword, 10);
    const result = await updateUser(
      { password: newHashedPassword },
      {
        where: {
          id: req.tokenData.id,
        },
        transaction: t,
      },
    );
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success change password',
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
