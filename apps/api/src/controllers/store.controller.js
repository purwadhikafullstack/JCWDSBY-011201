import stores from '../models/stores.model';

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
