import carts from '../models/carts.model';
import inventory from '../models/inventory.model';
import product from '../models/product.model';
import productImage from '../models/product-image.model';

export const addCarts = async (req, res, t) => {
  return await carts.create(
    { ...req.body, userId: req.tokenData.id },
    { transaction: t },
  );
};

export const incrementCartAmountBy1 = async (req, t) => {
  return await carts.increment('amount', {
    where: { inventoryId: req.body.inventoryId },
    transaction: t,
  });
};
export const findOneCartByInventoryId = async (req) => {
  return await carts.findOne({ where: { inventoryId: req.body.inventoryId } });
};
export const findOneCartById = async (req) => {
  return await carts.findOne({ where: { id: req.params.id }, raw: true });
};

export const updateCartsAmount = async (req, t) => {
  if (req.body.amount > 0) {
    return await carts.increment('amount', {
      by: req.body.amount,
      where: { id: req.params.id },
      transaction: t,
    });
  } else {
    return await carts.decrement('amount', {
      by: req.body.amount,
      where: { id: req.params.id },
      transaction: t,
    });
  }
};

export const updateChecks = async (req, t) => {
  const result = await findOneCartById(req);
  if (result) {
    return await carts.update(
      { checked: !result.checked },
      { where: { id: req.params.id }, transaction: t },
    );
  }
};

export const getCarts = async (req) => {
  return await carts.findAll({
    where: { userId: req.tokenData.id },
    raw: true,
    nest: true,
    include: [
      {
        model: inventory,
        as: 'inventory',
        required: true,
        where: { storeId: req.body.storeId },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
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
                attributes: ['image'],
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
    where: { checked: true },
    transaction: t,
  });

export const deleteAllProductInCartSpecificStore = async (req, t) =>
  await carts.destroy({
    where: { userId: req.tokenData.id, storeId: req.body.storeId },
    transaction: t,
  });
