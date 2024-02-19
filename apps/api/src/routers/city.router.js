import { Router } from 'express';
import { getAllCityController } from '../controllers/city.controller';
import { query } from 'express-validator';

const cityRouter = Router();

cityRouter.get(
  '/',
  query('provinceId').optional().escape(),
  getAllCityController,
);

export { cityRouter };
