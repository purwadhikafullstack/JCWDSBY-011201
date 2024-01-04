import carts from '../models/carts.model';

export const addCarts = async (req, res) => {
  return await carts.create(req.body);
};

export const updateCartsAmount = async (req) => {
  return await carts.increment('amount', { by: req.body.amount });
};

export const getCarts = async (req) => {
  return await carts.get({ where: { userId: req.tokenData.id }, raw: true });
};

export const deleteOneProductInCart = async (req) => (
    await carts.destroy({ where: { inventoryId: req.params.inventoryId}})
);




