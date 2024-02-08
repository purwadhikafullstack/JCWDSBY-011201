import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';
import user_addresses from '../../models/user-addresses.model';

export const findAllDistrictService = async (cityId = null) => {
  const filter = {};
  if (cityId !== null) {
    filter.cityId = cityId;
  }
  const result = await districts.findAll({ where: filter });
  return result;
};

export const findOneDistrictService = async (districtId) => {
  const result = await districts.findOne({ where: { id: districtId } });
  return result;
};

export const findAllCityService = async (provinceId = null) => {
  const filter = {};
  if (provinceId !== null) {
    filter.provinceId = provinceId;
  }
  const result = await cities.findAll({ where: filter });
  return result;
};

export const findOneCityService = async (cityId) => {
  const result = await cities.findOne({ where: { id: cityId } });
  return result;
};

export const findAllProvinceService = async () => {
  const result = await provinces.findAll();
  return result;
};

export const findOneProvinceService = async (provinceId) => {
  const result = await provinces.findOne({ where: { id: provinceId } });
  return result;
};

export const findAllUserAddressService = async (userId) => {
  const result = await user_addresses.findAll({
    where: {
      userId: userId,
    },
    order: [['isDefault', 'DESC']],
    attributes: {
      exclude: ['id', 'userId', 'createdAt', 'updatedAt', 'deletedAt'],
    },
    include: [
      { model: districts, attributes: ['districtName'] },
      { model: cities, attributes: ['cityName'] },
      { model: provinces, attributes: ['provinceName'] },
    ],
  });
  return result;
};

export const findDefaultUserAddressService = async (userId) => {
  const result = await user_addresses.findOne({
    where: { userId: userId, isDefault: true },
  });
  return result;
};

export const findOneUserAddressService = async (userId, addressUUID) => {
  const result = await user_addresses.findOne({
    where: {
      userId: userId,
      UUID: addressUUID,
    },
    attributes: {
      exclude: ['id', 'userId', 'createdAt', 'updatedAt', 'deletedAt'],
    },
  });
  return result;
};

export const createUserAddressService = async (data, transaction) => {
  const result = await user_addresses.create(data, {
    transaction: transaction,
  });
  return result;
};

export const updateUserAddressService = async (
  data,
  addressUUID,
  transaction,
) => {
  const result = await user_addresses.update(data, {
    where: { UUID: addressUUID },
    transaction: transaction,
  });
  return result;
};

export const deleteUserAddressService = async (addressUUID, transaction) => {
  const result = await user_addresses.destroy({
    where: { UUID: addressUUID, isDefault: false },
    transaction: transaction,
  });
  return result;
};
