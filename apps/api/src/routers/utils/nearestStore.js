import { findOneStore } from '../../controllers/store.controller';
import findNearestStore from '../../helper/findNearestStore';
import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';

export default async function (req, res, next) {
  try {
    const lat = req.query.lat ?? null;
    const lon = req.query.lon ?? null;
    const nearest = await findNearestStore(lat, lon);
    const response = {
      rc: 200,
      success: true,
      message: '',
      result: {},
    };
    if (!nearest) {
      const mainBranch = await findOneStore({
        where: { isMain: true },
        attributes: {
          exclude: [
            'id',
            'userId',
            'createdAt',
            'updatedAt',
            'deletedAt',
            'provinceId',
            'cityId',
            'districtId',
          ],
        },
        include: [
          { model: districts, attributes: ['districtName'] },
          { model: cities, attributes: ['cityName'] },
          { model: provinces, attributes: ['provinceName'] },
        ],
      });
      response.message = 'Out of range, nearest store set to main branch';
      mainBranch.dataValues.distance = null;
      response.result = { ...mainBranch.dataValues };
    } else {
      response.message = `Nearest store set to ${nearest.name}`;
      response.result = nearest;
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
