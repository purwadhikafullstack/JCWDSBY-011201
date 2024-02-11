import { Op } from 'sequelize';
import stores from '../../models/stores.model';
import users from '../../models/users.model';

export const findOneAdminByUsernameService = async (username) => {
  const result = await users.findOne({
    include: {
      model: stores,
      required: false,
    },
    where: {
      [Op.and]: [
        { email: username },
        { [Op.or]: [{ role: 'admin' }, { role: 'super' }] },
      ],
    },
  });
  return result;
};

export const findOneAdminByUUIDService = async (UUID) => {
  const result = await users.findOne({
    where: {
      UUID: UUID,
    },
  });
  return result;
};

export const findAllAddminServiceTemp = async () => {
  const result = await users.findAll({
    where: {
      role: 'admin',
    },
  });
  return result;
};
