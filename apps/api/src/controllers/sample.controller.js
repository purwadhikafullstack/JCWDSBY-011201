import Sample from '../models/sample.model';

export const getSampleData = async () => {
  return await Sample.findAll();
};

export const getSampleDataById = async () => {
  return { name: 'Sample data' };
};

export const createSampleData = async () => {
  console.log('Successfully create new sample data');
  return await Sample.create({ name: 'Sample data' })
};

export const uploadSampleData = async (image) => {
  return await Sample.bulkCreate(image);
};
