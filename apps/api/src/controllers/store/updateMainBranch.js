import { validationResult } from 'express-validator';
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw { rc: 400, message: 'invalid request' };
    const currDefault = await findMainStoreService();
    console.log('currDefault', currDefault);
    if (currDefault) {
      await updateStoreService(
        { isMain: false },
        currDefault.dataValues.UUID,
        t,
      );
    }
    console.log('curr Id', req.params.id);
    const result = await updateStoreService({ isMain: true }, req.params.id, t);

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
