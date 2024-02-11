import carts from '../models/carts.model';
import inventory from '../models/inventory.model';
import product from '../models/product.model';
import productImage from '../models/product-image.model';
import stores from '../models/stores.model';
import discount from '../models/discount.model';
import {
  addCarts,
  deleteOneProductInCart,
  findOneCartById,
  findOneCartByInventoryId,
  findStoreIdFromUUID,
  getCarts,
  getItemInCartDiscount,
  incrementCartAmountBy1,
  updateCartsAmount,
  updateChecks,
  updateChecksAll,
} from '../services/cart/cart.service';
import { getResultFilterer } from '../routers/cart/uniqueGet';
import {
  fuseDiscountAndItems,
  processedCartGetData,
} from '../routers/cart/getResult';
import resTemplate from '../helper/resTemplate';
import { DB } from '../db';
export const getCartsController = async (req, res, next) => {
  try {
    const storeData = await findStoreIdFromUUID(req);
    const result = await getCarts(req, storeData.id);
    const uniqueRes = getResultFilterer(result);
    const invIdRes = uniqueRes.map((item) => item.inventoryId);
    const discounts = await getItemInCartDiscount(invIdRes);
    const trueRes = processedCartGetData(uniqueRes);
    const fusedRes = fuseDiscountAndItems(trueRes, discounts);
    res.status(200).json({
      success: true,
      message: 'cart fetched successfully',
      data: fusedRes.filter((item) => item.productPrice !== 0),
      freeItems: fusedRes.filter((item) => item.productPrice === 0),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const postCartsController = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const result = await findOneCartByInventoryId(req);
    if (!result) {
      await addCarts(req, res, t);
      await t.commit();
      return res
        .status(200)
        .json({ success: 'success', message: 'Product added to cart' });
    } else {
      await incrementCartAmountBy1(req, t);
      await t.commit();
      return res
        .status(200)
        .json({ success: 'success', message: 'increase product amount by 1' });
    }
  } catch (error) {
    console.log(error);
    await t.rollback();
    next(error);
  }
};

export const checkAllController = async (req, res, next) => {
  await DB.initialize();
  try {
    await DB.db.sequelize.transaction(async (t) => {
      await updateChecksAll(req, t);
    });
    return res
      .status(200)
      .json(resTemplate(200, true, 'change checks all success'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteOneCartController = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    await deleteOneProductInCart(req, t);
    res.status(200).json(resTemplate(200, true, 'deleted'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateCartController = async (req, res, next) => {
  await DB.initialize();
  try {
    if (req.query.checker) {
      await DB.db.sequelize.transaction(async (t) => {
        await updateChecks(req, t);
      });
      return res
        .status(200)
        .json({ success: true, message: 'update item checked status success' });
    }
    const result = await findOneCartById(req);
    if (result.amount === 1 && req.body.amount < 1) {
      await DB.db.sequelize.transaction(async (t) => {
        await deleteOneProductInCart(req, t);
      });
      return res
        .status(200)
        .json({ success: true, message: 'Item deleted successfully' });
    }
    await DB.db.sequelize.transaction(async (t) => {
      await updateCartsAmount(req, t);
    });
    return res
      .status(200)
      .json({ success: true, message: 'Update cart Amount success' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// export const addCarts = async (req, res, t) => {
//   return await carts.create(
//     { ...req.body, userId: req.tokenData.id },
//     { transaction: t },
//   );
// };

// export const incrementCartAmountBy1 = async (req, t) => {
//   return await carts.increment('amount', {
//     where: { userId: req.tokenData.id, inventoryId: req.body.inventoryId },
//     transaction: t,
//   });
// };
// export const findOneCartByInventoryId = async (req) => {
//   return await carts.findOne({
//     where: { userId: req.tokenData.id, inventoryId: req.body.inventoryId },
//   });
// };
// export const findOneCartById = async (req) => {
//   return await carts.findOne({ where: { id: req.params.id }, raw: true });
// };

// export const updateCartsAmount = async (req, t) => {
//   return await carts.update(
//     { amount: req.body.amount },
//     {
//       where: { id: req.params.id },
//       transaction: t,
//     },
//   );
// };

// export const updateChecks = async (req, t) => {
//   const result = await findOneCartById(req);
//   if (result) {
//     return await carts.update(
//       { checked: req.body.checked },
//       { where: { id: req.params.id }, transaction: t },
//     );
//   }
// };
// export const updateChecksAll = async (req, t) => {
//   console.log(req.body);
//   return await carts.update(
//     { checked: req.body.checked },
//     {
//       where: {
//         userId: req.tokenData.id,
//         inventoryId: req.body.inventoryIdArray,
//       },
//       transaction: t,
//     },
//   );
// };

// export const findStoreIdFromUUID = async (req) => {
//   return await stores.findOne({
//     where: { UUID: req.query.UUID },
//     raw: true,
//     attributes: ['id', 'name'],
//   });
// };

// export const getCarts = async (req, storeId) => {
//   return await carts.findAll({
//     where: { userId: req.tokenData.id },
//     raw: true,
//     nest: true,
//     include: [
//       {
//         model: inventory,
//         as: 'inventory',
//         required: true,
//         where: { storeId },
//         attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
//         include: [
//           {
//             model: discount,
//             as: 'discounts',
//             attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
//           },
//           {
//             model: product,
//             as: 'product',
//             required: true,
//             attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
//             include: [
//               {
//                 model: productImage,
//                 as: 'product_images',
//                 required: true,
//                 attributes: ['image', 'productId', 'id'],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//     attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId'] },
//   });
// };

// export const deleteOneProductInCart = async (req, t) =>
//   await carts.destroy({
//     where: { id: req.params.id },
//     transaction: t,
//   });

// export const deleteCheckedItemInCart = async (req, t) =>
//   await carts.destroy({
//     where: { userId: req.tokenData.id, inventoryId: req.body.inventoryIdArray },
//     transaction: t,
//   });

// export const deleteAllProductInCartSpecificStore = async (req, t) =>
//   await carts.destroy({
//     where: { userId: req.tokenData.id, storeId: req.body.storeId },
//     transaction: t,
//   });

// export const getItemInCartDiscount = async (itemArray) => {
//   return await discount.findAll({
//     where: { inventoryId: itemArray },
//     raw: true,
//     nest:true,
//     attributes: { exclude: ['createdAt', 'updatedAt'] },
//   });
// };
