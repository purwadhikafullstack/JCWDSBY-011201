import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import {
  findMainStoreService,
  updateStoreService,
} from '../../services/store/store.service';

const updateMainBranch = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const currDefault = await findMainStoreService();
    if (currDefault) {
      await updateStoreService(
        { isMain: false },
        currDefault.dataValues.UUID,
        t,
      );
    }
    const result = await updateStoreService(
      { isMain: false },
      req.params.id,
      t,
    );

    if (!result[0]) {
      throw { rc: 404, message: 'Store not found' };
    }
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success edit store', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default updateMainBranch;
