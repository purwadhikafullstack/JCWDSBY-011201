import tokens from '../models/tokens.model';

export const findToken = async (pointer) => {
  return await tokens.findOne(pointer);
};

export const createToken = async (token, userId, method, trx) => {
  const currDate = new Date().getTime();
  const validUntil = new Date(currDate + 3600 * 1 * 1000);
  return await tokens.create(
    {
      token: token,
      userId: userId,
      method: method,
      validUntil: validUntil,
    },
    { transaction: trx },
  );
};

export const updateToken = async (data, pointer) => {
  return await tokens.update(data, pointer);
};
