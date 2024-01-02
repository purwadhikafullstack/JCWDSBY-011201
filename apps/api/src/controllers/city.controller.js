import cities from '../models/cities.model';

export const findAllCity = async (pointer) => {
  return await cities.findAll({ where: pointer });
};

export const findOneCity = async (pointer) => {
  return await cities.findOne({ where: pointer });
};
