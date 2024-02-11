import resTemplate from '../helper/resTemplate';
import { findAllProvinceService } from '../services/address/address.service';

export const getALlProvinceController = async (req, res, next) => {
  try {
    const result = await findAllProvinceService();
    return res
      .status(200)
      .json(resTemplate(200, true, 'Success get province data', result));
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};
