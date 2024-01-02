import { Router } from 'express';
import { findAllProvince } from '../controllers/province.controller';

const provinceRouter = Router();

provinceRouter.get('/', async (req, res, next) => {
  try {
    const result = await findAllProvince();
    return res.status(200).json({
      rc: 200,
      success: true,
      message: 'Success get province data',
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
});

export { provinceRouter };
