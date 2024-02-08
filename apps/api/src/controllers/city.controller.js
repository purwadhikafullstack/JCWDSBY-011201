import resTemplate from '../helper/resTemplate';
import { findAllCityService } from '../services/address/address.service';

export const getAllCityController = async (req, res, next) => {
  try {
    const result = await findAllCityService(req.query?.provinceId || null);
    return res
      .status(200)
      .json(resTemplate(200, true, 'Success get all city', result));
  } catch (error) {
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};
