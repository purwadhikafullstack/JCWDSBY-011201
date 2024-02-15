import { Router } from "express";
import uploader from "../helper/uploader";
import {
  createProductImage,
  deleteProductImage,
} from "../controllers/product-image.controller";
import { validateSuper, validateToken } from "../middleware/tokenValidation";

const productImageRouter = Router();

productImageRouter.post('/', validateToken, validateSuper, uploader('/product', 1).array('productUpload', 3), createProductImage)

productImageRouter.delete('/:id', validateToken, validateSuper, deleteProductImage);

export { productImageRouter };