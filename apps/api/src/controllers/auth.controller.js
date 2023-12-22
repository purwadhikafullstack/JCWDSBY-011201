import users from '../models/users.model';

export const createUser = async (data) => {
  return await users.create(data);
};

export const findUser = async (pointer) => {
  return await users.findOne({
    where: pointer,
  });
};

export const updateUser = async (data, pointer) => {
  return await users.update(data, {
    where: pointer,
  });
};
