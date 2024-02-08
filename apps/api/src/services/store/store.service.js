import { Op } from 'sequelize';
import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';
import stores from '../../models/stores.model';
import users from '../../models/users.model';

export const findAllStoreService = async (query = '', page = -1) => {
  const filter = {
    where: { name: { [Op.substring]: query } },
    order: [['isMain', 'DESC']],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    },
    include: [
      { model: users, attributes: ['name'] },
      { model: districts, attributes: ['districtName'] },
      { model: cities, attributes: ['cityName'] },
      { model: provinces, attributes: ['provinceName'] },
    ],
  };
  if (page > 0) {
    filter.limit = 8;
    filter.offset = page * 8 - 8;
  }
  const result = await stores.findAll(filter);

  return result;
};

export const getStoreByUUIDService = async (UUID) => {
  try {
    const result = await stores.findOne({
      where: { UUID },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getStoreDetailByUUIDService = async (UUID) => {
  const result = await stores.findOne({
    where: {
      UUID: UUID,
    },
    include: [
      {
        model: users,
        attributes: ['UUID'],
      },
    ],
    attributes: {
      exclude: ['id', 'createdAt', 'userId', 'updatedAt', 'deletedAt'],
    },
  });
  return result;
};

export const findMainStoreService = async () => {
  const result = await stores.findOne({
    where: { isMain: true },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    },
    include: [
      { model: users, attributes: ['name'] },
      { model: districts, attributes: ['districtName'] },
      { model: cities, attributes: ['cityName'] },
      { model: provinces, attributes: ['provinceName'] },
    ],
  });
  return result;
};

export const createStoreService = async (data, transaction) => {
  const result = await stores.create(data, { transaction: transaction });
  return result;
};

export const updateStoreService = async (data, storeUUID, transaction) => {
  const result = await stores.update(data, {
    where: {
      UUID: storeUUID,
    },
    transaction: transaction,
  });
  return result;
};

export const deleteStoreService = async (storeUUID, transaction) => {
  const result = await stores.destroy({
    where: {
      UUID: storeUUID,
      isMain: false,
    },
    transaction: transaction,
  });
  return result;
};
