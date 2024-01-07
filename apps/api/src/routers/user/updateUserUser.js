import { findOneUser, updateUser } from '../../controllers/user.controller';
import { DB } from '../../db';
import fs from 'fs';

export default async function updateUserUser(req, res, next) {
  await DB.initialize();
  const t = await DB.sequelize.transaction();
  try {
    console.log(req.file);
    const data = {
      name: req.body.name,
    };

    const currImage = await findOneUser({ where: { id: req.tokenData.id } });

    if (req.file?.filename) data.image = req.file.filename;

    const result = await updateUser(data, {
      where: {
        id: req.tokenData.id,
      },
      transaction: t,
    });

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
    const newData = await findOneUser({ where: { id: req.tokenData.id } });
    const { name, email, image, role, type } = newData.dataValues;
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success update user data',
      result: {
        name,
        email,
        image,
        role,
        type,
      },
    });
  } catch (error) {
    console.log(error.message);
    await t.rollback();
    if (req.file?.filename) {
      fs.unlinkSync(req.file.destination + '/' + req.file.filename);
    }
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
