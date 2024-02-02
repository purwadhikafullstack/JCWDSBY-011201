import stores from '../models/stores.model';
import { getStoreByUUIDService } from '../services/store/store.service';
import resTemplate from '../helper/resTemplate';

export const findAllStores = async (pointer) => {
  return await stores.findAll(pointer);
};

export const findOneStore = async (pointer) => {
  return await stores.findOne(pointer);
};

export const createStore = async (data, pointer) => {
  return await stores.create(data, pointer);
};

export const updateStore = async (data, pointer) => {
  return await stores.update(data, pointer);
};

export const deleteStore = async (pointer) => {
  return await stores.destroy(pointer);
};

export const getStoreByUUID = async (req, res, next) => {
  try {
    const result = await getStoreByUUIDService(req.params.UUID)

    return res.status(200).json(resTemplate(200, true, 'Update discount success!', result));
  } catch (error) {
    next(error);
  }
};