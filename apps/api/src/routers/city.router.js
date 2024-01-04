import { Router } from 'express';
import { findAllCity } from '../controllers/city.controller';

const cityRouter = Router();

cityRouter.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query?.provinceId) {
      filter.provinceId = req.query.provinceId;
    }
    const result = await findAllCity(filter);
    return res.status(200).json({
      rc: 200,
      success: true,
      message: 'Success get city data',
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

export { cityRouter };
