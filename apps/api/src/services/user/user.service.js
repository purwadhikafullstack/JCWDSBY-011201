import { Op } from 'sequelize';
import users from '../../models/users.model';

export const findAllUserService = async (queryParam) => {
  try {
    const limit = queryParam.limit ?? 'none';
    const page = queryParam.page ?? 1;
    const name = queryParam.name ?? '';
    const email = queryParam.email ?? '';

    const params = {
      where: {
        name: {
          [Op.substring]: name
        },
        email: {
          [Op.substring]: email
        },
        role: 'user'
      },
      limit: parseInt(limit),
      offset: page * parseInt(limit) - parseInt(limit),
      attributes: ['name', 'email', 'isVerified'],
    };

    if (limit === 'none') {
      delete params.limit;
      delete params.offset;
    }

    const result = await users.findAndCountAll(params);

    if (limit !== 'none') result.totalPage = Math.ceil(result.count / limit);

    return result;
  } catch (error) {
    throw error;
  }
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
