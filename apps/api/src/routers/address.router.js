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

const addressRouter = Router();

addressRouter.get('/', validateToken, validateUser, getAddressesController);
addressRouter.get(
  '/:id',
  validateToken,
  validateUser,
  getAddressDetailController,
);
addressRouter.post('/', validateToken, validateUser, createAddressController);
addressRouter.patch(
  '/:id',
  validateToken,
  validateUser,
  updateAddressController,
);
addressRouter.patch(
  '/:id/default',
  validateToken,
  validateUser,
  updateDefaultAddressController,
);
addressRouter.delete(
  '/:id',
  validateToken,
  validateUser,
  deleteAddressController,
);

export { addressRouter };
