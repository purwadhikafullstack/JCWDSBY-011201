import { Router } from "express";
import {
    deleteProduct,
    getProduct,
    createProduct,
    getProductDetail,
    updateProduct,
} from "../controllers/product.controller";
import { validateSuper, validateToken } from "../middleware/tokenValidation";

const productRouter = Router();

productRouter.get('/', getProduct);
productRouter.get('/:name', getProductDetail);
productRouter.post('/', validateToken, validateSuper, createProduct);
productRouter.patch('/:id', validateToken, validateSuper, updateProduct);
productRouter.delete('/:id', validateToken, validateSuper, deleteProduct);

export { productRouter };