import { Router } from 'express';
import {
  checkAllController,
  deleteCheckedItemController,
  deleteOneCartController,
  deleteOneItemController,
  getCartsController,
  postCartsController,
  updateCartController,
} from '../controllers/carts.controller';
import { validateToken, validateUser } from '../middleware/tokenValidation';
const cartRouter = Router();
//GET
cartRouter.get('/', validateToken, validateUser, getCartsController);
//POST
cartRouter.post('/', validateToken, validateUser, postCartsController);

//PATCH

cartRouter.patch('/checkall', validateToken, checkAllController);
//Delete
cartRouter.delete('/:id', validateToken, deleteOneCartController);

cartRouter.patch('/:id', validateToken, updateCartController);

//Delete

cartRouter.delete('/', validateToken, deleteCheckedItemController);

cartRouter.delete('/delete/:id', validateToken, deleteOneItemController);
export { cartRouter };
