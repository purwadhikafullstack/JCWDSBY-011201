import { Router } from 'express';
import { DB } from '../db';
import { addCarts, deleteOneProductInCart, getCarts, updateCartsAmount } from '../controllers/carts.controller';
import { validateToken } from '../middleware/tokenValidation';

const cartRouter = Router();

//GET
cartRouter.get('/', async (req, res, next) => {
  try {
    const result = await getCarts(req);
    res
      .status(200)
      .send({
        success: true,
        message: 'cart fetched successfully',
        data: result,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//POST
cartRouter.post('/',validateToken, async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction()
  try {
    await addCarts(req, res,t);
    res.status(200).send({ success: true, message: 'Product added to cart' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//PATCH
cartRouter.patch('/:id',validateToken, async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction()
  try {
    await updateCartsAmount(req,t);
    res
      .status(200)
      .send({ success: true, message: 'Update cart Amount success' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//Delete 
cartRouter.delete("/:id",validateToken,async (req,res,next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction()
  try {
    await deleteOneProductInCart(req,t)
  } catch (error) {
    console.log(error)
    next(error);
  }
})

cartRouter.delete("/:id",validateToken,async () => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction()
}
)
export { cartRouter };
