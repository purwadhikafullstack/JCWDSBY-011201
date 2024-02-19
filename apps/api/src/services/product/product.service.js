import product from "../../models/product.model";
import categories from "../../models/categories.model";
import productImage from "../../models/product-image.model";
import { DB } from '../../db';
import resTemplate from "../../helper/resTemplate";
import inventory from "../../models/inventory.model";
import { unlink, existsSync } from "fs";
import { assetsDir } from "../../constants/assets";
import { Op } from "sequelize";

export const getProductService = async (queryParam) => {
  try {
    const limit = queryParam.limit ?? 'none';
    const page = queryParam.page ?? 1;
    const name = queryParam.q ?? '';

    const params = {
      where: {
        name: {
          [Op.substring]: name,
        }
      },
      include: [
        {
          model: categories,
          as: 'category',
          required: true,
          attributes: ['id', 'name'],
        },
        {
          model: productImage,
          required: true,
          attributes: ['id', 'image'],
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      limit: parseInt(limit),
      offset: page * parseInt(limit) - parseInt(limit),
      distinct: true,
    }

    if (limit === 'none') {
      delete params.limit;
      delete params.offset;
    }

    const result = await product.findAndCountAll(params);
    if (limit !== 'none') result.totalPage = Math.ceil(result.count / limit);
    return result
  } catch (error) {
    throw error;
  }
};

export const getProductDetailService = async (productName) => {
  try {
    const result = await product.findOne({
      where: {
        name: productName,
      },
      include: [
        {
          model: categories,
          as: 'category',
          required: true,
          attributes: ['id', 'name'],
        },
        {
          model: productImage,
          required: true,
          attributes: ['id', 'image'],
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    });
    return result
  } catch (error) {
    throw error;
  }
};

export const createProductService = async (data) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const duplicateProduct = await product.findOne({
      where: {
        name: data.name
      }
    }, { transaction: t })
    if (duplicateProduct) {
      throw resTemplate(409, false, 'Product already exists', null);
    }

    const result = await product.create({
      name: data.name,
      price: data.price,
      description: data.description,
      categoryId: data.categoryId,
      weight: data.weight,
      unit: data.unit,
    }, { transaction: t });

    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateProductService = async (id, data) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    if (Object.hasOwn(data, 'name')) {
      const duplicateName = await product.findOne({
        where: {
          name: data.name,
        }
      }, { transaction: t });

      if (duplicateName) {
        throw resTemplate(304, false, 'Product already exists', null);
      }
    }

    const result = await product.update(data, {
      where: { id },
      transaction: t
    });

    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteProductService = async (id) => {
  try {
    const deleteProduct = await product.destroy({
      where: { id }
    })

    if (deleteProduct) {
      await inventory.destroy({
        where: { productId: id }
      });
      const image = await productImage.findAll({
        where: { productId: id }
      });
      if (image.length > 0) {
        image.forEach(image => {
          if (existsSync(assetsDir + image.image)) {
            return unlink(assetsDir + image.image, (err) => {
              if (err) throw err;
            });
          }
        });
      }
      return await productImage.destroy({
        where: { productId: id }
      });
    }
  } catch (error) {
    throw error;
  }
};

export const getLatestProductService = async (queryParam) => {
  try {
    let limit = queryParam?.limit ?? 'none';

    let query = {
      attributes: ['name'],
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    }

    if(limit === 'none') delete query.limit;

    const result = await product.findAll(query);
    return result
  } catch (error) {
    throw error;
  }
};