import inventory from '../../models/inventory.model';
import product from '../../models/product.model';
import productImage from '../../models/product-image.model';
import stores from '../../models/stores.model';
import discount from '../../models/discount.model';
import carts from '../../models/carts.model';
import { Op } from 'sequelize';

export const addCarts = async (req, res, t) => {
  return await carts.create(
    { ...req.body, userId: req.tokenData.id },
    { transaction: t },
  );
};

export const incrementCartAmountBy1 = async (req, t) => {
  return await carts.increment('amount', {
    where: { userId: req.tokenData.id, inventoryId: req.body.inventoryId },
    transaction: t,
  });
};
export const findOneCartByInventoryId = async (req) => {
  return await carts.findOne({
    where: { userId: req.tokenData.id, inventoryId: req.body.inventoryId },
  });
};
export const findOneCartById = async (req) => {
  return await carts.findOne({ where: { id: req.params.id }, raw: true });
};

export const updateCartsAmount = async (req, t) => {
  return await carts.update(
    { amount: req.body.amount },
    {
      where: { id: req.params.id },
      transaction: t,
    },
  );
};

export const updateChecks = async (req, t) => {
  const result = await findOneCartById(req);
  if (result) {
    return await carts.update(
      { checked: req.body.checked },
      { where: { id: req.params.id }, transaction: t },
    );
  }
};
export const updateChecksAll = async (req, t) => {
  console.log(req.body);
  return await carts.update(
    { checked: req.body.checked },
    {
      where: {
        userId: req.tokenData.id,
        inventoryId: req.body.inventoryIdArray,
      },
      transaction: t,
    },
  );
};

export const findStoreIdFromUUID = async (req) => {
  return await stores.findOne({
    where: { UUID: req.query.UUID },
    raw: true,
    attributes: ['id', 'name'],
  });
};

export const getCarts = async (req, storeId) => {
  return await carts.findAll({
    where: { userId: req.tokenData.id },
    raw: true,
    nest: true,
    include: [
      {
        model: inventory,
        as: 'inventory',
        required: true,
        where: { storeId },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          {
            model: discount,
            as: 'discounts',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
          {
            model: product,
            as: 'product',
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [
              {
                model: productImage,
                as: 'product_images',
                required: true,
                attributes: ['image', 'productId', 'id'],
              },
            ],
          },
        ],
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId'] },
  });
};

export const deleteOneProductInCart = async (req, t) =>
  await carts.destroy({
    where: { id: req.params.id },
    transaction: t,
  });

export const deleteCheckedItemInCart = async (req, t) =>
  await carts.destroy({
    where: { userId: req.tokenData.id, inventoryId: req.body.inventoryIdArray },
    transaction: t,
  });

export const deleteAllProductInCartSpecificStore = async (req, t) =>
  await carts.destroy({
    where: { userId: req.tokenData.id, storeId: req.body.storeId },
    transaction: t,
  });

export const getItemInCartDiscount = async (itemArray) => {
  return await discount.findAll({
    where: { inventoryId: itemArray, endTime: { [Op.gte]: new Date() } },
    raw: true,
    nest: true,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};
