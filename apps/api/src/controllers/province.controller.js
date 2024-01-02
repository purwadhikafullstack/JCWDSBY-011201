import provinces from '../models/provinces.model';

export const findAllProvince = async (pointer) => {
  return await provinces.findAll({ where: pointer });
};

export const findOneProvince = async (pointer) => {
  return await provinces.findOne({ where: pointer });
};
