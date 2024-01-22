import { Router } from 'express';
import nearestStore from './utils/nearestStore';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import shippingAddress from './utils/shippingAddress';
import courierRates from './utils/courierRates';

const utilsRouter = Router();

utilsRouter.get('/store/nearest', nearestStore);
utilsRouter.get(
  '/shipping-address',
  validateToken,
  validateUser,
  shippingAddress,
);
utilsRouter.post('/courier-rates', validateToken, validateUser, courierRates);

export { utilsRouter };
