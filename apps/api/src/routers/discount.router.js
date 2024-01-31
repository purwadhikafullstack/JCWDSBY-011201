import { Router } from "express";
import { validateToken, validateAdmin} from "../middleware/tokenValidation";
import { createDiscount, deleteDiscount, getDiscount } from "../controllers/discount.controller";


const discountRouter = Router();

discountRouter.get('/', validateToken, validateAdmin, getDiscount);
discountRouter.post('/', validateToken, validateAdmin, createDiscount);
discountRouter.delete('/:id', validateToken, validateAdmin, deleteDiscount);

export { discountRouter };