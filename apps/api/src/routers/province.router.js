import { Router } from 'express';
import { getALlProvinceController } from '../controllers/province.controller';

const provinceRouter = Router();

provinceRouter.get('/', getALlProvinceController);

export { provinceRouter };
