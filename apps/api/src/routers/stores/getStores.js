import { findAllStores } from '../../controllers/store.controller';
import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';
import users from '../../models/users.model';

export default async function (req, res, next) {
  try {
    const result = await findAllStores({
      order: [['isMain', 'DESC']],
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
      },
      include: [
        { model: users, attributes: ['name'] },
        { model: districts, attributes: ['districtName'] },
        { model: cities, attributes: ['cityName'] },
        { model: provinces, attributes: ['provinceName'] },
      ],
    });

    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success get all stores',
      result: result,
    });
  } catch (error) {
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
