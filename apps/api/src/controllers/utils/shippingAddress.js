import { MAX_DISTANCE } from '../../config';
import calculateDistance from '../../helper/calculateDistance';
import resTemplate from '../../helper/resTemplate';
import { findAllUserAddressService } from '../../services/address/address.service';
import { getStoreByUUIDService } from '../../services/store/store.service';

export default async function (req, res, next) {
  try {
    const storeData = await getStoreByUUIDService(req.query.storeId);
    const userAddresses = await findAllUserAddressService(req.tokenData.id);

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

    return res
      .status(201)
      .json(
        resTemplate(
          201,
          true,
          'Success get shipping address',
          availableAddress,
        ),
      );
  } catch (error) {
    next(error);
  }
}
