import { Router } from 'express';
import { getAllDistrictController } from '../controllers/district.controller';

const districtRouter = Router();

districtRouter.get('/', getAllDistrictController);

export { districtRouter };
