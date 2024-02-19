import { Op, literal, col } from "sequelize";
import product from "../../models/product.model";
import categories from "../../models/categories.model";
import productImage from "../../models/product-image.model";
import store from "../../models/stores.model";
import users from "../../models/users.model";
import discount from "../../models/discount.model";
import inventory from "../../models/inventory.model";
import resTemplate from "../../helper/resTemplate";


export const getInventoryService = async (queryParams) => {
  try {
    const query = queryParams.q ?? '';
    const category = queryParams.category ?? '';
    const sort = queryParams.sort ?? 'none';
    const email = queryParams.admin ?? '';
    const storeUUID = queryParams.store ?? '';
    const page = queryParams.page ?? 1;
    const limit = queryParams.limit ?? 5;
    let order = [];
    
    if (sort === 'lowest') order.push(col('productPrice'), 'ASC');
    if (sort === 'highest') order.push(col('productPrice'), 'DESC');
    if (sort === 'lowestStock') order.push('stock', 'ASC');
    if (sort === 'highestStock') order.push('stock', 'DESC');
    if (sort === 'nameasc' || sort === 'none') order.push(col('productName'), 'ASC');
    if (sort === 'namedesc') order.push(col('productName'), 'DESC');

    const params = {
      include: [
        {
          model: product,
          required: true,
          where: { name: { [Op.substring]: query } },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt', 'categoryId'],
          },
          include: [
            {
              model: categories,
              as: 'category',
              required: true,
              where: { name: { [Op.substring]: category } },
              attributes: ['id', 'name'],
            },
            {
              model: productImage,
              required: true,
              attributes: ['id', 'image']
            }
          ]
        },
        {
          model: store,
          required: true,
          where: { UUID: { [Op.substring]: storeUUID } },
          attributes: ['id', 'name'],
          include: [
            {
              model: users,
              as: 'user',
              required: true,
              where: { email: { [Op.substring]: email } },
              attributes: ['name'],
            }
          ]
        },
        {
          model: discount,
          required: false,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          }
        }
      ],
      attributes: [[literal('product.name'), 'productName'], [literal('product.price'), 'productPrice'], 'stock', 'id'],
      limit: parseInt(limit),
      offset: page * parseInt(limit) - parseInt(limit),
      order: [order],
      distinct: true,
    }

    if (limit === 'none') {
      delete params.limit;
      delete params.offset;
    }

    const result = await inventory.findAndCountAll(params);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getInventoryDetailService = async (name, queryParams) => {
  try {
    const storeUUID = queryParams.store ?? '';

    const result = await inventory.findOne({
      include: [
        {
          model: product,
          as: 'product',
          required: true,
          where: { name },
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'categoryId'] },
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
        },
        {
          model: store,
          required: true,
          attributes: ['UUID', 'name'],
          where: { UUID: { [Op.substring]: storeUUID } },
          include: [
            {
              model: users,
              as: 'user',
              required: true,
              attributes: ['name'],
            },
          ],
        },
        {
          model: discount,
          required: false,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          }
        }
      ],
      attributes: ['id', [col('product.price'), 'productPrice'], 'stock'],
    });
    if (!result) throw resTemplate(404, false, 'Inventory not found');
    return result;
  } catch (error) {
    throw error;
  }
};