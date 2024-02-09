import { Op } from 'sequelize';
import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';
import users from '../../models/users.model';
import { findAllStoreService } from '../../services/store/store.service';
import resTemplate from '../../helper/resTemplate';

export default async function (req, res, next) {
  try {
    const page = req.query.page ?? 1;
    const query = req.query.q ?? '';
    const result = await findAllStoreService(query, page);
    const count = await findAllStoreService(query);
    return res.status(201).json(
      resTemplate(201, true, 'Success get all stores', {
        row: count.length,
        data: result,
        raw: count,
      }),
    );
  } catch (error) {
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
}
