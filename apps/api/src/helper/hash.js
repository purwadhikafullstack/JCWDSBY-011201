import bcrypt from 'bcrypt';

export const hashPassword = async (data, saltRounds) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedData = await bcrypt.hash(data, saltRounds);
  return hashedData;
};

export const verifyPassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};
