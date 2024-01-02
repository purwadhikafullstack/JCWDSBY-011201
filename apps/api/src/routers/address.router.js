import { Router } from 'express';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import createAddress from './address/createUserAddress';
import deleteAddress from './address/deleteUserAddress';
import getAddres from './address/getUserAddres';
import updateAddress from './address/updateUserAddress';
import updateDefaultAddress from './address/updateDefaultAddress';

const addressRouter = Router();

addressRouter.get('/', validateToken, validateUser, getAddres);
addressRouter.post('/', validateToken, validateUser, createAddress);
addressRouter.patch('/:id', validateToken, validateUser, updateAddress);
addressRouter.patch(
  '/:id/default',
  validateToken,
  validateUser,
  updateDefaultAddress,
);
addressRouter.delete('/:id', validateToken, validateUser, deleteAddress);

export { addressRouter };
