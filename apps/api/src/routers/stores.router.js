import { Router } from 'express';
import { validateSuper, validateToken, validateAdmin } from '../middleware/tokenValidation';
import getStores from './stores/getStores';
import getStoreDetail from './stores/getStoreDetail';
import createStore from './stores/createStore';
import updateStore from './stores/updateStore';
import updateMainBranch from './stores/updateMainBranch';
import deleteStore from './stores/deleteStore';
import getMainStore from './stores/getMainStore';
import { getStoreByUUID } from '../controllers/store.controller';

const storesRouter = Router();

storesRouter.get('/', validateToken, validateSuper, getStores);
storesRouter.get('/main', validateToken, validateSuper, getMainStore);
storesRouter.get('/UUID/:UUID', validateToken, validateAdmin, getStoreByUUID);
storesRouter.get('/:id', validateToken, validateSuper, getStoreDetail);
storesRouter.post('/', validateToken, validateSuper, createStore);
storesRouter.patch('/:id', validateToken, validateSuper, updateStore);
storesRouter.patch('/:id/main', validateToken, validateSuper, updateMainBranch);
storesRouter.delete('/:id', validateToken, validateSuper, deleteStore);

export { storesRouter };
