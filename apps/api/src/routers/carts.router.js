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
} from '../controllers/carts.controller';
import { validateToken } from '../middleware/tokenValidation';
import { PRODUCT_URL } from '../config';
import { processedCartGetData } from './cart/getResult';
import { getResultFilterer } from './cart/uniqueGet';
const cartRouter = Router();
//GET
cartRouter.get('/', validateToken, async (req, res, next) => {
  try {
    const storeData = await findStoreIdFromUUID(req)
    const result = await getCarts(req,storeData.id);
    // const productIdArray = result.map((val,idx)=>val.inventory.productId)
    const uniqueRes = getResultFilterer(result)
    const trueRes = processedCartGetData(uniqueRes)
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
        .json({ success: true, message: 'Product added to cart' });
    } else {
      await incrementCartAmountBy1(req, t);
      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: 'increase product amount by 1' });
    }
  } catch (error) {
    console.log(error);
    await t.rollback();
    next(error);
  }
});

//PATCH
cartRouter.patch('/:id', validateToken, async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    if (req.query.checker) {
      await updateChecks(req,t)
      await t.commit()
      return res
        .status(200)
        .json({ success: true, message: 'update item checked status success' });
    }
    const result = await findOneCartById(req);
    if (result.amount === 1 && req.body.amount < 0) {
      await deleteOneProductInCart(req, t);
      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: 'Item deleted successfully' });
    }
    await updateCartsAmount(req, t);
    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: 'Update cart Amount success' });
  } catch (error) {
    console.log(error);
    await t.rollback();
    next(error);
  }
});
cartRouter.patch('/checkall',validateToken,async(req,res,next)=>{
  await DB.initialize()
  const t = await DB.db.sequelize.transaction()
  try {
    
  } catch (error) {
    
  }
})
//Delete
cartRouter.delete('/:id', validateToken, async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    await deleteOneProductInCart(req, t);
    await t.commit();
    return res
      .status(200)
      .send({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.log(error);
    await t.rollback();
    next(error);
  }
});

cartRouter.delete('/', validateToken, async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  console.log(req.query);
  try {
    if (req.query.checked) {
      await deleteCheckedItemInCart(req, t);
      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: 'checked items deleted successfully' });
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'required parameter' });
    }
  } catch (error) {
    console.log(error);
    await t.rollback();
    next(error);
  }
});
export { cartRouter };
