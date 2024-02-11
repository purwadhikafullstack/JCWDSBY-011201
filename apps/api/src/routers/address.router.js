import { Router } from 'express';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import {
  createAddressController,
  deleteAddressController,
  getAddressDetailController,
  getAddressesController,
  updateAddressController,
  updateDefaultAddressController,
} from '../controllers/address.controller';
import { body, param } from 'express-validator';

const addressRouter = Router();

addressRouter.get('/', validateToken, validateUser, getAddressesController);
addressRouter.get(
  '/:id',
  validateToken,
  validateUser,
  param('id').notEmpty().escape(),
  getAddressDetailController,
);
addressRouter.post(
  '/',
  validateToken,
  validateUser,
  body(['district', 'city', 'province', 'address', 'postalCode'])
    .notEmpty()
    .escape(),
  createAddressController,
);
addressRouter.patch(
  '/:id',
  validateToken,
  validateUser,
  param('id').notEmpty().escape(),
  body(['district', 'city', 'province', 'address', 'postalCode'])
    .notEmpty()
    .escape(),
  updateAddressController,
);
addressRouter.patch(
  '/:id/default',
  validateToken,
  validateUser,
  param('id').notEmpty().escape(),
  updateDefaultAddressController,
);
addressRouter.delete(
  '/:id',
  validateToken,
  validateUser,
  param('id').notEmpty().escape(),
  deleteAddressController,
);

export { addressRouter };
