import tokens from '../../models/tokens.model';

export const createTokenService = async (
  token,
  userId,
  method,
  transaction,
) => {
  const currDate = new Date().getTime();
  const validUntil = new Date(currDate + 3600 * 1 * 1000);
  const result = await tokens.create(
    {
      token: token,
      userId: userId,
      method: method,
      validUntil: validUntil,
    },
    { transaction: transaction },
  );
  return result;
};

export const findValidTokenService = async (token) => {
  const result = await tokens.findOne({
    where: { token: token, isValid: true },
  });
  return result;
};

export const deactivateTokenService = async (userId, method, transaction) => {
  const result = await tokens.update(
    { isValid: false },
    {
      where: { userId: userId, method: method },
      transaction: transaction,
    },
  );
  return result;
};
