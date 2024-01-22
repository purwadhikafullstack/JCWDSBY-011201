import {
  findOneUserAddress,
  updateUserAddress,
} from '../../controllers/address.controller';
import { DB } from '../../db';

export default async function (req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const currDefault = await findOneUserAddress({
      where: { userId: req.tokenData.id, isDefault: true },
    });

    if (currDefault) {
      await updateUserAddress(
        { isDefault: false },
        {
          where: {
            id: currDefault.dataValues.id,
          },
          transaction: t,
        },
      );
    }

    const result = await updateUserAddress(
      { isDefault: true },
      {
        where: { UUID: req.params.id, userId: req.tokenData.id },
        transaction: t,
      },
    );

    if (!result[0]) {
      throw { rc: 404, message: 'Address not found' };
    }
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success edit address',
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
