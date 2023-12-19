import categories from "../models/categories.model";
import { unlink } from "fs";

const dir = './src/assets/category/';

export const createCategory = async (data) => {
  return await categories.create(data);
};

export const getCategoryData = async () => {
  return await categories.findAll();
};

export const updateCategory = async (id, data, image) => { 
  if(image){
    const prevData = await categories.findByPk(id);

    await categories.update(
      { 
        name: data.name, 
        image: image.filename 
      }, 
      { where: { id } 
    });

    unlink(dir + prevData.image, (err) => {
      if (err) Error(err);
    });
  }

  await categories.update(
    { 
      name: data.name
    }, 
    { where: { id } 
  });
};

export const deleteCategory = async (id) => { 
  const prevData = await categories.findByPk(id);

  await categories.destroy({ where: { id } });

  unlink(dir + prevData.image, (err) => {
    if (err) Error(err);
  });
};
