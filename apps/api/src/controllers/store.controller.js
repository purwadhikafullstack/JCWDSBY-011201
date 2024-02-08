import { getStoreByUUIDService } from '../services/store/store.service';
import resTemplate from '../helper/resTemplate';
import createStore from './store/createStore';
import deleteStore from './store/deleteStore';
import getMainStore from './store/getMainStore';
import getStoreDetail from './store/getStoreDetail';
import getStores from './store/getStores';
import updateMainBranch from './store/updateMainBranch';
import updateStore from './store/updateStore';

export const createStoreController = createStore;
export const deleteStoreController = deleteStore;
export const getMainStoreController = getMainStore;
export const getStoreDetailController = getStoreDetail;
export const getStoresController = getStores;
export const updateMainBranchController = updateMainBranch;
export const updateStoreController = updateStore;

export const getStoreByUUID = async (req, res, next) => {
  try {
    const result = await getStoreByUUIDService(req.params.UUID);

    return res
      .status(200)
      .json(resTemplate(200, true, 'Update discount success!', result));
  } catch (error) {
    next(error);
  }
};
