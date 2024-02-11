import { Router } from 'express';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import {
  courierRatesController,
  nearestStoreController,
  shippingAddressController,
} from '../controllers/utils.controller';

const utilsRouter = Router();

utilsRouter.get('/store/nearest', nearestStoreController);
utilsRouter.get(
  '/shipping-address',
  validateToken,
  validateUser,
  shippingAddressController,
);
utilsRouter.post(
  '/courier-rates',
  validateToken,
  validateUser,
  courierRatesController,
);

export { utilsRouter };
