import resTemplate from '../../helper/resTemplate';
import { findAllUserAddressService } from '../../services/address/address.service';

const getAddresses = async (req, res, next) => {
  try {
    const result = await findAllUserAddressService(req.tokenData.id);
    resTemplate(201, true, 'Success get all address', result);
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success get all address', result));
  } catch (error) {
    return res
      .status(error.rc || 500)
      .json(
        resTemplate(error.rc || 500, false, 'Failed get all address', null),
      );
  }
};

export default getAddresses;
