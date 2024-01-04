import { deleteUserAddress } from '../../controllers/address.controller';
import { DB } from '../../db';

export default async function (req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const result = await deleteUserAddress({
      where: {
        id: req.params.id,
        isDefault: false,
      },
    });
    if (!result) {
      throw {
        rc: 404,
        message: 'Address not found or cannot delete default address',
      };
    }
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success delete address',
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
