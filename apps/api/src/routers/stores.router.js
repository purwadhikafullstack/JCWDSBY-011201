import { Router } from 'express';
import {
  validateAdmin,
  validateSuper,
  validateToken,
} from '../middleware/tokenValidation';
import {
  createStoreController,
  deleteStoreController,
  getMainStoreController,
  getStoreByUUID,
  getStoreDetailController,
  getStoresController,
  updateMainBranchController,
  updateStoreController,
} from '../controllers/store.controller';
import { body, param, query } from 'express-validator';

const storesRouter = Router();

storesRouter.get(
  '/',
  validateToken,
  validateSuper,
  query('q').optional().escape(),
  query('page').optional().escape(),
  getStoresController,
);
storesRouter.get('/main', validateToken, validateSuper, getMainStoreController);
storesRouter.get(
  '/UUID/:UUID',
  validateToken,
  validateSuper,
  param('UUID').notEmpty().escape(),
  getStoreByUUID,
);
storesRouter.get(
  '/:id',
  validateToken,
  validateSuper,
  param('id').notEmpty().escape(),
  getStoreDetailController,
);
storesRouter.post(
  '/',
  validateToken,
  validateSuper,
  body([
    'storeName',
    'district',
    'city',
    'province',
    'user',
    'address',
    'postalCode',
  ])
    .notEmpty()
    .escape(),
  createStoreController,
);
storesRouter.patch(
  '/:id',
  validateToken,
  validateSuper,
  param('id').notEmpty().escape(),
  body([
    'storeName',
    'district',
    'city',
    'province',
    'user',
    'address',
    'postalCode',
  ])
    .notEmpty()
    .escape(),
  updateStoreController,
);
storesRouter.patch(
  '/:id/main',
  validateToken,
  validateSuper,
  param('id').notEmpty().escape(),
  updateMainBranchController,
);
storesRouter.delete(
  '/:id',
  validateToken,
  validateSuper,
  param('id').notEmpty().escape(),
  deleteStoreController,
);

export { storesRouter };
