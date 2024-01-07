import { findAllUserAddress } from '../../controllers/address.controller';
import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';

export default async function (req, res, next) {
  try {
    const result = await findAllUserAddress({
      where: {
        userId: req.tokenData.id,
      },
      order: [['isDefault', 'DESC']],
      attributes: {
        exclude: ['id', 'userId', 'createdAt', 'updatedAt', 'deletedAt'],
      },
      include: [
        { model: districts, attributes: ['districtName'] },
        { model: cities, attributes: ['cityName'] },
        { model: provinces, attributes: ['provinceName'] },
      ],
    });

    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success get all address',
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
