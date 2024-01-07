import { findOneStore, updateStore } from '../../controllers/store.controller';
import { DB } from '../../db';

export default async function (req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const currDefault = await findOneStore({
      where: { isMain: true },
    });

    if (currDefault) {
      await updateStore(
        { isMain: false },
        {
          where: {
            UUID: currDefault.dataValues.id,
          },
          transaction: t,
        },
      );
    }

    const result = await updateStore(
      { isDefault: true },
      {
        where: { UUID: req.params.id },
        transaction: t,
      },
    );

    if (!result[0]) {
      throw { rc: 404, message: 'Store not found' };
    }
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success edit store',
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
