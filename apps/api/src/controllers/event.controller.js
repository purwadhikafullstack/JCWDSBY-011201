import events from '../models/events.model';

export const findAllEvent = async (pointer) => {
  return await events.findAll(pointer);
};

export const findOneEvent = async (pointer) => {
  return await events.findOne(pointer);
};

export const createEvent = async (data, pointer) => {
  return await events.create(data, pointer);
};

export const updateEvent = async (data, pointer) => {
  return await events.update(data, pointer);
};

export const deleteEvent = async (pointer) => {
  return await events.destroy(pointer);
};
