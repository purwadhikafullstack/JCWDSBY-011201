import { validationResult } from 'express-validator';
import { hashPassword, verifyPassword } from '../../helper/hash';
import resTemplate from '../../helper/resTemplate';
import {
  findOneUserByIdService,
  updateUserDataService,
} from '../../services/user/user.service';
import { DB } from '../../db';

const changePassword = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw { rc: 400, message: 'Invalid request' };
    const userData = await findOneUserByIdService(req.tokenData.id);
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
    const result = await updateUserDataService(
      { password: newHashedPassword },
      req.tokenData.id,
      t,
    );
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success change password', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default changePassword;
