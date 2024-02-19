import fs from 'fs';
import { DB } from '../../db';
import {
  findOneUserByIdService,
  updateUserDataService,
} from '../../services/user/user.service';
import resTemplate from '../../helper/resTemplate';
import { validationResult } from 'express-validator';

const updateUserUser = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw { rc: 400, message: 'Invalid request' };
    const data = {
      name: req.body.name,
    };

    const currImage = await findOneUserByIdService(req.tokenData.id);

    if (req.file?.filename) data.image = req.file.filename;

    const result = await updateUserDataService(data, req.tokenData.id, t);

    if (!result[0]) {
      throw { rc: 401, message: 'Failed to update user data' };
    }

    if (req.file?.filename) {
      const dir = './src/assets/avatar/';
      if (currImage.dataValues.image) {
        fs.unlinkSync(dir + currImage.dataValues.image);
      }
    }
    await t.commit();
    const newData = await findOneUserByIdService(req.tokenData.id);
    const { name, email, image, role, type } = newData.dataValues;
    resTemplate();
    return res.status(201).json(
      resTemplate(201, true, 'Success update user data', {
        name,
        email,
        image,
        role,
        type,
      }),
    );
  } catch (error) {
    await t.rollback();
    if (req.file?.filename) {
      fs.unlinkSync(req.file.destination + '/' + req.file.filename);
    }
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default updateUserUser;
