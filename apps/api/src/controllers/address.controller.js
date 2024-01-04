import user_addresses from '../models/user-addresses.model';

export const findAllUserAddress = async (pointer) => {
  return await user_addresses.findAll(pointer);
};

export const findOneUserAddress = async (pointer) => {
  return await user_addresses.findOne(pointer);
};

export const createUserAddress = async (data, pointer) => {
  return await user_addresses.create(data, pointer);
};

export const updateUserAddress = async (data, pointer) => {
  return await user_addresses.update(data, pointer);
};

export const deleteUserAddress = async (pointer) => {
  return await user_addresses.destroy(pointer);
};
