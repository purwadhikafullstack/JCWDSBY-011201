import category from "../models/categories.model";
import { unlink } from "fs";

const dir = './src/assets/category/';

export const createCategory = async (data, image) => {
  const value = image ? {name: data.name, image: image.filename} : {name: data.name};
  return await category.create(value);
};

export const getCategoryData = async () => {
  return await category.findAll();
};

export const getCategoryDataById = async (id) => {
  return await category.findByPk(id);
};

export const updateCategory = async (id, data, image) => { 
  if(image){
    const prevData = await category.findByPk(id);

    await category.update(
      { 
        name: data.name, 
        image: image.filename 
      }, 
      { where: { id } 
    });

    unlink(dir + prevData.image, (err) => {
      if (err) throw Error(err);
    });
  }

  await category.update(
    { 
      name: data.name
    }, 
    { where: { id } 
  });
};

export const deleteCategory = async (id) => { 
  const prevData = await category.findByPk(id);

  await category.destroy({ where: { id } });

  unlink(dir + prevData.image, (err) => {
    if (err) throw Error(err);
  });
};
