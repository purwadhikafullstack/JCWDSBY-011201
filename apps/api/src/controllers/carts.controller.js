import {
  addCarts,
  deleteCheckedItemInCart,
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

export const deleteCheckedItemController = async (req, res, next) => {
  await DB.initialize();
  try {
    await DB.db.sequelize.transaction(async (t) => {
      await deleteCheckedItemInCart(req, t);
    });
    return res
      .status(200)
      .json({ success: true, message: 'checked items deleted successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteOneItemController = async (req, res, next) => {
  await DB.initialize();
  try {
    await DB.db.sequelize.transaction(async (t) => {
      await deleteOneProductInCart(req, t);
    });
    return res
      .status(200)
      .json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

