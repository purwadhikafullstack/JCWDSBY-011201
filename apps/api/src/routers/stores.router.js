import { Router } from 'express';
import { validateAdmin, validateSuper, validateToken } from '../middleware/tokenValidation';
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

const storesRouter = Router();

storesRouter.get('/', validateToken, validateAdmin, getStoresController);
storesRouter.get('/main', validateToken, validateSuper, getMainStoreController);
storesRouter.get('/UUID/:UUID', validateToken, validateSuper, getStoreByUUID);
storesRouter.get(
  '/:id',
  validateToken,
  validateSuper,
  getStoreDetailController,
);
storesRouter.post('/', validateToken, validateSuper, createStoreController);
storesRouter.patch('/:id', validateToken, validateSuper, updateStoreController);
storesRouter.patch(
  '/:id/main',
  validateToken,
  validateSuper,
  updateMainBranchController,
);
storesRouter.delete(
  '/:id',
  validateToken,
  validateSuper,
  deleteStoreController,
);

export { storesRouter };
