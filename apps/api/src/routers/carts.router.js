import { Router } from 'express';
import { DB } from '../db';
import {
  addCarts,
  checkAllController,
  deleteCheckedItemInCart,
  deleteOneCartController,
  deleteOneProductInCart,
  findOneCartById,
  findOneCartByInventoryId,
  getCartsController,
  incrementCartAmountBy1,
  postCartsController,
  updateCartController,
  updateCartsAmount,
  updateChecks,
  updateChecksAll,
} from '../controllers/carts.controller';
import { validateToken, validateUser } from '../middleware/tokenValidation';
import resTemplate from '../helper/resTemplate';
const cartRouter = Router();
//GET
cartRouter.get('/', validateToken, validateUser, getCartsController);
//POST
cartRouter.post('/', validateToken, validateUser, postCartsController);

//PATCH

cartRouter.patch('/checkall', validateToken, checkAllController);
//Delete
cartRouter.delete('/:id', validateToken,deleteOneCartController )

cartRouter.patch('/:id', validateToken, updateCartController);

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
