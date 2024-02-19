import { Router } from 'express';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import {
  courierRatesController,
  nearestStoreController,
  shippingAddressController,
} from '../controllers/utils.controller';
import { body, query } from 'express-validator';

const utilsRouter = Router();

utilsRouter.get('/store/nearest', nearestStoreController);
utilsRouter.get(
  '/shipping-address',
  validateToken,
  validateUser,
  query('storeId').notEmpty(),
  shippingAddressController,
);
utilsRouter.post(
  '/courier-rates',
  validateToken,
  validateUser,
  body('items').notEmpty().isArray(),
  body('storePostal').notEmpty().isNumeric(),
  body('userPostal').notEmpty().isNumeric(),
  courierRatesController,
);

export { utilsRouter };
