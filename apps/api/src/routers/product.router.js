import { Router } from "express";
import {
    getProductData,
    getInventoryData,
    createProduct,
    updateProduct,
    updateInventory, 
    deleteProduct,
    deleteInventory,
    findProductByName,
    findProductByCategory,
} from "../controllers/product.controller";
import getAllProduct from "./product/getAllProduct";
import getAllInventory from "./inventory/getAllInventory";

const productRouter = Router();

productRouter.get('/', getAllProduct);

productRouter.get('/inventory', getAllInventory);

productRouter.get('/:name', async (req, res, next) => {
    try {
        const result = await findProductByName(req.params.name);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

productRouter.get('/category/:name', async (req, res, next) => {
    try {
        const result = await findProductByCategory(req.params.name);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


productRouter.post('/', async (req, res, next) => {
    try {
        const result = await createProduct(1, req.body); //! TODO: add validation (store id is required)
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

productRouter.patch('/:id', async (req, res, next) => {
    try {
        await updateProduct(req.params.id, req.body);
        res.status(200).json('Product updated');
    } catch (error) {
        next(error)
    }
});

productRouter.patch('/inventory/:id', async (req, res, next) => {
    try {
        await updateInventory(req.params.id, req.body);
        res.status(200).json('Inventory updated');
    } catch (error) {
        next(error)
    }
});

productRouter.delete('/:id', async (req, res, next) => {
    try {
        await deleteProduct(req.params.id);
        res.status(200).json('Product deleted');
    } catch (error) {
        next(error)
    }
});

productRouter.delete('/inventory/:id', async (req, res, next) => {
    try {
        await deleteInventory(req.params.id);
        res.status(200).json('Inventory deleted');
    } catch (error) {
        next(error)
    }
});

export { productRouter };