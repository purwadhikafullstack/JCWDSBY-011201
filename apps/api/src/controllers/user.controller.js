import users from '../models/users.model';

export const createUser = async (data, pointer) => {
  return await users.create(data, pointer);
};

export const findOneUser = async (pointer) => {
  return await users.findOne(pointer);
};

export const findAllUser = async (pointer) => {
  return await users.findAll(pointer);
};

export const updateUser = async (data, pointer) => {
  return await users.update(data, pointer);
};

export const deleteUser = async (pointer) => {
  return await users.destroy(pointer);
};