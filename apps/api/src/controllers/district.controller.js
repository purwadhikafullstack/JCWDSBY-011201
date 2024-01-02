import districts from '../models/districts.model';

export const findAllDistrict = async (pointer) => {
  return await districts.findAll({ where: pointer });
};

export const findOneDistrict = async (pointer) => {
  return await districts.findOne({ where: pointer });
};
