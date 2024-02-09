import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import { deleteStoreService } from '../../services/store/store.service';

const deleteStore = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const result = await deleteStoreService(req.params.id, t);
    if (!result) {
      throw {
        rc: 404,
        message: 'Store not found or cannot delete default store',
      };
    }
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success delete store', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default deleteStore;
