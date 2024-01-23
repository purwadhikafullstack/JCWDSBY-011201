import { Router } from 'express';
import { DB } from '../db';
import {
  addCarts,
  deleteCheckedItemInCart,
  deleteOneProductInCart,
  findOneCartById,
  findOneCartByInventoryId,
  findStoreIdFromUUID,
  getCarts,
  incrementCartAmountBy1,
  updateCartsAmount,
  updateChecks,
  updateChecksAll,
} from '../controllers/carts.controller';
import { validateToken } from '../middleware/tokenValidation';
import resTemplate from '../helper/resTemplate';
import { processedCartGetData } from './cart/getResult';
import { getResultFilterer } from './cart/uniqueGet';
const cartRouter = Router();
//GET
cartRouter.get('/', validateToken, async (req, res, next) => {
  try {
    const storeData = await findStoreIdFromUUID(req);
    const result = await getCarts(req, storeData.id);
    // const productIdArray = result.map((val,idx)=>val.inventory.productId)
    const uniqueRes = getResultFilterer(result);
    const trueRes = processedCartGetData(uniqueRes);
    res.status(200).json({
      success: true,
      message: 'cart fetched successfully',
      data: trueRes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//POST
cartRouter.post('/', validateToken, async (req, res, next) => {
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
});

//PATCH

cartRouter.patch('/checkall', validateToken, async (req, res, next) => {
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
});
//Delete
cartRouter.delete('/:id', validateToken, async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    await deleteOneProductInCart(req, t);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

cartRouter.patch('/:id', validateToken, async (req, res, next) => {
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
});

//Delete

cartRouter.delete('/', validateToken, async (req, res, next) => {
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
});

cartRouter.delete('/delete/:id', validateToken, async (req, res, next) => {
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
});
export { cartRouter };
