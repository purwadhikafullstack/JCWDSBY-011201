import resTemplate from '../helper/resTemplate';
import { findAllDistrictService } from '../services/address/address.service';

export const getAllDistrictController = async (req, res, next) => {
  try {
    const result = await findAllDistrictService(req.query?.cityId || null);
    return res
      .status(200)
      .json(resTemplate(200, true, 'Success get district data', result));
  } catch (error) {
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};
