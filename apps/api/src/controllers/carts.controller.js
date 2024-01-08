import carts from '../models/carts.model';
import inventory from "../models/inventory.model";

export const addCarts = async (req, res, t) => {
  return await carts.create(
    { ...req.body, userId: req.tokenData.id },
    { transaction: t },
  );
};

export const updateCartsAmount = async (req, t) => {
  return await carts.increment('amount', {
    by: req.body.amount,
    transaction: t,
  });
};

export const getCarts = async (req) => {
  return await carts.get({ where: { userId: req.tokenData.id }, raw: true });
};

export const deleteOneProductInCart = async (req, t) =>
  await carts.destroy({
    where: { inventoryId: req.params.inventoryId },
    transaction: t,
  });

export const deleteAllProductInCartSpecificStore = async (req, t) =>
  await carts.destroy({
    where: { userId: req.tokenData.id, storeId: req.body.storeId },
  });
