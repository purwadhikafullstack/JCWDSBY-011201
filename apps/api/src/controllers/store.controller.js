import {
  findAllStoreService,
  getStoreByUUIDService,
} from '../services/store/store.service';
import resTemplate from '../helper/resTemplate';
import createStore from './store/createStore';
import deleteStore from './store/deleteStore';
import getMainStore from './store/getMainStore';
import getStoreDetail from './store/getStoreDetail';
import getStores from './store/getStores';
import updateMainBranch from './store/updateMainBranch';
import updateStore from './store/updateStore';
import { validationResult } from 'express-validator';

export const createStoreController = createStore;
export const deleteStoreController = deleteStore;
export const getMainStoreController = getMainStore;
export const getStoreDetailController = getStoreDetail;
export const getStoresController = getStores;
export const updateMainBranchController = updateMainBranch;
export const updateStoreController = updateStore;

export const getStoreByUUID = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw { rc: 400, message: 'Invalid request' };
    const result = await getStoreByUUIDService(req.params.UUID);

    return res
      .status(200)
      .json(resTemplate(200, true, 'Update discount success!', result));
  } catch (error) {
    next(error);
  }
};

export const getStoresLandingController = async (req, res, next) => {
  try {
    const result = await findAllStoreService();
    const finalResult = result.map((val) => {
      const value = val.dataValues;
      delete value.id;
      delete value.userId;
      delete value.user;
      return { ...value };
    });
    return res
      .status(200)
      .json(resTemplate(200, true, 'Get store list success', finalResult));
  } catch (error) {
    console.log(error);
    next();
  }
};
