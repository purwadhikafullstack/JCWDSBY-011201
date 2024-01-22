import { Op } from "sequelize";
import category from "../models/categories.model";
import { unlink, existsSync } from "fs";

const dir = './src/assets/category/';

export const createCategory = async (data, image) => {
  const checkCategory = await category.findOne({
    where: {
      name: data.name,
    }
  });
  
  if (checkCategory) {
    throw {
      rc: 409,
      success: false,
      message: 'Category already exists',
      result: null,
    }
  }

  const value = image ? { name: data.name, image: image.filename } : { name: data.name };
  return await category.create(value);
};

export const getCategoryData = async () => {
  return await category.findAll();
};

export const getCategoryDataById = async (id) => {
  return await category.findByPk(id);
};

export const updateCategory = async (id, data, image) => {
  if(Object.hasOwn(data, 'name')){
    const checkCategory = await category.findOne({ where: {name: data.name} });
    if (checkCategory) {
      throw {
        rc: 409,
        success: false,
        message: 'Category already exists',
        result: null,
      }
    }
  }

  if (image) {
    const prevData = await category.findByPk(id);

    await category.update(
      Object.hasOwn(data, 'name') ? {name: data.name,image: image.filename} : {image: image.filename}
      ,{
        where: { id }
      });

    if (existsSync(dir + prevData.image)) {
      console.log('updating image');
      unlink(dir + prevData.image, (err) => {
        if (err) throw Error(err);
      });
    }
  }

  await category.update(
    {
      name: data.name
    },
    {
      where: { id }
    });
};

export const deleteCategory = async (id) => {
  const prevData = await category.findByPk(id);

  await category.destroy({ where: { id } });

  if (existsSync(dir + prevData.image)) {
    unlink(dir + prevData.image, (err) => {
      if (err) throw Error(err);
    });
  }
};
