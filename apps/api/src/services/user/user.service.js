import { Op } from 'sequelize';
import users from '../../models/users.model';

export const findAllUserService = async (query = '', page = -1) => {
  const filter = {
    where: { name: { [Op.substring]: query }, role: 'user' },
    attributes: ['name', 'email', 'isVerified'],
  };
  if (page > 0) {
    filter.limit = 8;
    filter.offset = page * 8 - 8;
  }
  const result = await findAllUser(filter);
  return result;
};

export const findOneUserByIdService = async (userId) => {
  const result = await users.findOne({
    where: {
      id: userId,
    },
  });
  return result;
};

export const findOneUserByEmailService = async (email) => {
  const result = await users.findOne({
    where: { email: email },
  });
  return result;
};

export const findOneUserByEmailAndTypeService = async (email, type) => {
  const result = await users.findOne({
    where: { email: email, type: type },
  });
  return result;
};

export const createUserService = async (data = {}, transaction) => {
  const result = await users.create(data, { transaction: transaction });
  return result;
};

export const verifyUserAccountService = async (
  password,
  email,
  transaction,
) => {
  const result = await users.update(
    {
      password: password,
      isVerified: true,
    },
    {
      where: { email: email },
      transaction: transaction,
    },
  );
  return result;
};

export const updateUserPasswordService = async (
  newPassword,
  userId,
  transaction,
) => {
  const result = await users.update(
    {
      password: newPassword,
    },
    {
      where: {
        [Op.and]: [{ id: userId }, { type: 'regular' }],
      },
      transaction: transaction,
    },
  );
  return result;
};

export const updateUserDataService = async (data, userId, transaction) => {
  const result = users.update(data, {
    where: {
      id: userId,
    },
    transaction: transaction,
  });
  return result;
};
