import { Router } from 'express';
import { addCarts, getCarts, updateCartsAmount } from '../controllers/carts.controller';

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
cartRouter.post('/', async (req, res, next) => {
  try {
    await addCarts(req, res);
    res.status(200).send({ success: true, message: 'adding to cart success' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//PATCH
cartRouter.patch('/id', async (req, res, next) => {
  try {
    await updateCartsAmount(req);
    res
      .status(200)
      .send({ success: true, message: 'Updated cart Amount success' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export { cartRouter };
