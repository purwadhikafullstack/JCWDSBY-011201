import { MAX_DISTANCE } from '../../config';
import { findAllUserAddress } from '../../controllers/address.controller';
import { findOneStore } from '../../controllers/store.controller';
import calculateDistance from '../../helper/calculateDistance';
import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';

export default async function (req, res, next) {
  try {
    const storeData = await findOneStore({
      where: {
        UUID: req.query.storeId,
      },
    });
    const userAddresses = await findAllUserAddress({
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

    const availableAddress = [];

    for (let i = 0; i < userAddresses.length; i++) {
      const distance = calculateDistance(
        Number(storeData.dataValues.lat),
        Number(storeData.dataValues.lon),
        Number(userAddresses[i].lat),
        Number(userAddresses[i].lon),
      );
      if (distance <= MAX_DISTANCE) {
        availableAddress.push(userAddresses[i]);
      }
    }

    // console.log('hasil query', availableAddress);
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success get shipping address',
      result: availableAddress,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
