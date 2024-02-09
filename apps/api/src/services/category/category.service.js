import { col, fn, literal } from "sequelize";
import categories from "../../models/categories.model";
import product from "../../models/product.model";
import resTemplate from "../../helper/resTemplate";
import { unlink, existsSync } from "fs";

const dir = './src/assets/category/';

export const getCategoryService = async (queryParam) => {
  try {
    const limit = queryParam.limit ?? 'none';
    const page = queryParam.page ?? 1;

    const params = {
      attributes: [
        'id', 'name', 'image',
        [
          literal(`(
            SELECT COUNT(products.id) FROM products WHERE products.categoryId = categories.id AND products.deletedAt IS NULL
          )`), 'productCount'
        ]
      ],
      limit: parseInt(limit),
      offset: page * parseInt(limit) - parseInt(limit),
      distinct: true,
    }

    if (limit === 'none') {
      delete params.limit;
      delete params.offset;
    }

    const result = await categories.findAndCountAll(params);
    if (limit !== 'none') result.totalPage = Math.ceil(result.count / limit);

    return result
  } catch (error) {
    throw error;
  }
}

export const createCategoryService = async (data, image) => {
  try {
    const checkCategory = await categories.findOne({
      where: {
        name: data.name,
      }
    });

    if (checkCategory) throw resTemplate(409, false, 'Category already exists');

    const value = image ? { name: data.name, image: image.filename } : { name: data.name };
    return await categories.create(value);
  } catch (error) {
    throw error;
  }
};

export const getCategoryDetailService = async (id) => {
  try {
    return await categories.findByPk(id);
  } catch (error) {
    throw error;
  }
};

export const updateCategoryService = async (id, data, image) => {
  try {
    if (Object.hasOwn(data, 'name')) {
      const checkCategory = await categories.findOne({ where: { name: data.name } });
      if (checkCategory) throw resTemplate(409, false, 'Category already exists');
    }

    if (image) {
      const prevData = await categories.findByPk(id);

      await categories.update(
        Object.hasOwn(data, 'name') ? { name: data.name, image: image.filename } : { image: image.filename }
        , {
          where: { id }
        });

      if (existsSync(dir + prevData.image)) {
        unlink(dir + prevData.image, (err) => {
          if (err) throw Error(err);
        });
      }
    }

    await categories.update({ name: data.name }, {
      where: { id }
    });
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryService = async (id) => {
  try {
    const prevData = await categories.findByPk(id);

    await categories.destroy({ where: { id } });

    if (existsSync(dir + prevData.image)) {
      unlink(dir + prevData.image, (err) => {
        if (err) throw Error(err);
      });
    }
  } catch (error) {
    throw error;
  }
};