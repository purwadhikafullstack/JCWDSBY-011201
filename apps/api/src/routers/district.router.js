import { Router } from 'express';
import { findAllDistrict } from '../controllers/district.controller';

const districtRouter = Router();

districtRouter.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query?.cityId) {
      filter.cityId = req.query.cityId;
    }
    const result = await findAllDistrict(filter);
    return res.status(200).json({
      rc: 200,
      success: true,
      message: 'Success get district data',
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
});

export { districtRouter };
