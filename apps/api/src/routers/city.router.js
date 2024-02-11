import { Router } from 'express';
import { getAllCityController } from '../controllers/city.controller';

const cityRouter = Router();

cityRouter.get('/', getAllCityController);

export { cityRouter };
