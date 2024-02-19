import { Router } from 'express';
import { getAllDistrictController } from '../controllers/district.controller';
import { query } from 'express-validator';

const districtRouter = Router();

districtRouter.get(
  '/',
  query('cityId').optional().escape(),
  getAllDistrictController,
);

export { districtRouter };
